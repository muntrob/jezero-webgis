import 'ol/ol.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';
import {Fill, Stroke, Circle, Style, Text} from 'ol/style';
import {Vector} from 'ol/layer';
import TileWMS from 'ol/source/TileWMS';
import LayerGroup from 'ol/layer/Group';
import { Control, FullScreen, defaults as defaultControls, ScaleLine, ZoomToExtent } from 'ol/control';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import Select from 'ol/interaction/Select';
//import WebGLPointsLayer from 'ol/layer/WebGLPoints';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

import '@fortawesome/fontawesome-free/css/all.css';

import Sidebar from 'sidebar-v2/js/ol3-sidebar.mjs';
import 'sidebar-v2/css/ol3-sidebar.css';

import { register } from 'ol/proj/proj4';
import { Projection, getTransform, get, transform, addProjection, addCoordinateTransforms } from 'ol/proj';
import { getDistance } from 'ol/sphere';
import proj4 from 'proj4';

import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';

import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

import dateformat from 'dateformat';

import { click } from "ol/events/condition";

//import * as THREE from 'three';
//import * as PANOLENS from 'panolens';
import  AFRAME from 'aframe';

import './jezero.css';


import {
  and as andFilter,
  equalTo as equalToFilter,
  like as likeFilter,
  greaterThanOrEqualTo as greaterThanOrEqualToFilter,
  lessThanOrEqualTo as lessThanOrEqualToFilter
} from "ol/format/filter";


//------------------------------------------------------------------------------------------
// Global variables/constants
//------------------------------------------------------------------------------------------
var mapdiv = document.getElementById('map');

const product_types = ['3d', 'an', 'co', 'ctxt', 'ft', 'ht', 'nd'];
const product_types_desc = ['Perspective View', 'Red-Cyan Anaglyph', 'RGB Color Image', 'Context Map', 'Annotated Image', 'Color-coded DTM (Digital Terrain Model) with Nadir', 'Nadir Image'];
let wfsProductid = null;
let wfsFilename = null;
let wfsTarget = null;
var currentFeature;
var currentYear = new Date().getFullYear();
var startYear="2006";
var stopYear="2020";
var textarray=[];
textarray[0]=`
<h3>Pliva Vallis</h3><p>Pliva Vallis in the east of Jezero Crater is the outflow channel through
which water was discharged from the crater. This is why this former crater
lake is referred to as an ‘open basin lake’. These lakes were once
numerous on Mars. Compared to closed basins (with inflow but no outflow),
they are interesting because they were freshwater lakes with a stable
water level. Lakes in closed basins, on the other hand, were subjected to
more frequent periods of drying out, which turned them into salt lakes,
thus making them less promising in the search for conditions that are
conducive to life.</p>
`
textarray[1]=`
<h3>Delta basement</h3><p>Volcanic minerals, carbonates and clay minerals have been found both in
the delta and elsewhere in the crater. Some carbonates are thought to have
been formed directly in the lake. Such lake carbonates and especially the
clay minerals indicate freshwater conditions that enable life and have the
potential to preserve biosignatures particularly well in their interior.
However, other types of minerals have also been discovered there, namely
those that paint a different picture of the crater lake. These include
sulphates that contain iron oxide, amorphous silicon oxides and
hydroxides, which tend to form in acidic waters that gradually dried up.
These minerals indicate that the environmental conditions in Jezero Crater
became drier and less conducive to life at a later stage. But even among
these minerals there are some in which biosignatures can be very well
preserved.
</p>
`
textarray[2]=`
<h3>Delta top</h3><p>Volcanic minerals, carbonates and clay minerals have been found both in
the delta and elsewhere in the crater. Some carbonates are thought to have
been formed directly in the lake. Such lake carbonates and especially the
clay minerals indicate freshwater conditions that enable life and have the
potential to preserve biosignatures particularly well in their interior.
However, other types of minerals have also been discovered there, namely
those that paint a different picture of the crater lake. These include
sulphates that contain iron oxide, amorphous silicon oxides and
hydroxides, which tend to form in acidic waters that gradually dried up.
These minerals indicate that the environmental conditions in Jezero Crater
became drier and less conducive to life at a later stage. But even among
these minerals there are some in which biosignatures can be very well
preserved.
</p>
`
textarray[3]=`
<h3>Neretva Vallis</h3><p>Neretva Vallis is an inflow channel that created a delta on the western
and northwestern rim of the crater, which are also considered evidence for
the existence of a former lake. Perseverance will examine the larger of
the two in the west in more detail.</p>
`
textarray[4]=`
<h3>Jezero Crater (center)</h3><p>This is a view from the crater center at higher altitude. From here you
have a perfect overview over Jezero and can spot the delta, the inflow-
and the outflow channels in the distance. Also very well visible is the
asymetry of the crater. The rims of Jezero are pretty shallow in the
northeastern part and much steeper towards the south.</p>
`
textarray[5]=`
<h3>Mountain view</h3><p>The Mountain View viewpoint offers a perfect vista into the crater.
This viewpoint is located on top of the large hill southeast of the crater.
From here, the observer can see that the northern part of the crater floor is sloping and that the northern crater rim is clearly less defined, compared to the flat, smooth crater floor in the south and the much steeper southern crater rim flanks.
This appearance originates from the erosion of material in the catchment areas to the north of the crater, which was then transported into the crater basin itself and deposited in the deltas. Also contributing to the asymmetrical topography is the erosion of the northern crater rim, caused by the river valleys breaking through the flank of Jezero.</p>
`
textarray[6]=`
<h3>Mars 2020 Rover &ldquo;Perseverance&rdquo; landing site</h3><p>The NASA Mars 2020 mission is en route to Mars since July 30th 2020.
On board: The NASA rover “Perseverance”, the most complex equipment ever sent to Mars.
Besides numerous scientific instruments, it will carry containers for a drill core sample collection that will be left on
Mars for a later return to Earth carried out by follow-up missions planned for the 2030s.
The approximately one metric ton heavy vehicle is set to land on 18 February 2021 at 21:55 CET in Jezero crater and will
then start the search for traces of microbial life.
The working group at Freie Universitaet Berlin is involved with Prof. Jaumann, serving as Co-Investigator on the Mastcam Z instrument.
“Ingenuity” is the name of a 1.8 kg heavy helicopter drone onboard the rover that will be used as near field reconnaissance instrument.</p>
`
textarray[7]=`
<h3>Sava Vallis</h3><p>Sava Vallis is an inflow channel that created a delta on the western and
northwestern rim of the crater, which are also considered evidence for the
existence of a former lake. Perseverance will examine the larger of the
two in the west in more detail.</p>
`
textarray[8]=`
<h3>Paleo lake view</h3><p>This view was created by plotting an estimated former lake level derived
from putative paleolake-shorelines and the upper delta-top boundary. The
Jezero crater lake must have been filled with water even more to overcome
the swell of the Pliva Vallis outflow channel.</p>
`
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Auxiliary functions
//------------------------------------------------------------------------------------------
// Function: Check if file is accessible by the provided link
// Source: https://stackoverflow.com/questions/5115141/check-if-a-file-exists-locally-using-javascript-only
function LinkCheck(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

// Function: Create camel case string
// Source: https://www.geeksforgeeks.org/how-to-convert-string-to-camel-case-in-javascript/
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index == 0 ? word.toUpperCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
};
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Projection
//------------------------------------------------------------------------------------------
proj4.defs("EPSG:49901", "+proj=longlat +R=3396190 +no_defs");
proj4.defs("EPSG:49910", "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R=3396190 +units=m +no_defs");
proj4.defs("EPSG:49911", "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R=3396190 +units=m +no_defs");
register(proj4);

var projection49910 = new Projection({
  code: "EPSG:49910",
  global: true,
  units: 'm',
  //extent: [4000000, 0, 4500000, 500000],
  extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
  //extent: [4536590.000, 1013775.000, 4683160.000, 1180560.000],
  //extent: [4363662.941221565, 859975.4272094945, 4808874.452132847, 1296750.544287833],
  getPointResolution: function(resolution, point) {
    var toEPSG49901 = getTransform(get("EPSG:49910"), get("EPSG:49901"));
    var vertices = [ point[0] - resolution / 2, point[1], point[0] + resolution / 2, point[1] ];
    vertices = toEPSG49901(vertices, vertices, 2);
    return getDistance(vertices.slice(0, 2), vertices.slice(2, 4), 3396190);
  }
});
addProjection(projection49910);
var projection49911 = new Projection({
  ////code: "EPSG:49911",
  code: "EPSG:49910",
  global: true,
  units: 'm',
  //extent: [4000000, 0, 4500000, 500000],
//  extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
  extent: [-92160000000, -46080000000, 92160000000, 46080000000],
  // extent: [-21337697.304, -10431763.126, 21337697.304, 10431763.126],
  // extent: [-40668848.652, -40215881.563, 40668848.652, 40215881.563],
  // extent: [-45668848.652, -45215881.563, 45668848.652, 45215881.563],
  ////extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
  //extent: [4536590.000, 1013775.000, 4683160.000, 1180560.000],
  //extent: [4363662.941221565, 859975.4272094945, 4808874.452132847, 1296750.544287833],
  getPointResolution: function(resolution, point) {
    ////var toEPSG49901 = getTransform(get("EPSG:49911"), get("EPSG:49901"));
    var toEPSG49901 = getTransform(get("EPSG:49910"), get("EPSG:49901"));
    var vertices = [ point[0] - resolution / 2, point[1], point[0] + resolution / 2, point[1] ];
    vertices = toEPSG49901(vertices, vertices, 2);
    //console.log(vertices);
    return getDistance(vertices.slice(0, 2), vertices.slice(2, 4), 3396190);
  }
});
addProjection(projection49911);
var projection49901 = new Projection({
    code: 'EPSG:49901',
    extent: [-180, -90, 180, 90],
    units: 'degrees'
});
addProjection(projection49901);

addCoordinateTransforms(
  projection49901,
  projection49911,
  function (coordinate) {
    var xdst=3396190*(coordinate[0]/180*Math.PI);
    var ydst=3396190*(coordinate[1]/180*Math.PI);
    return [ xdst, ydst ];
  },
  function (coordinate) {
    var xdst=(coordinate[0]*180/Math.PI)/3396190;
    var ydst=(coordinate[1]*180/Math.PI)/3396190;
    return [ xdst, ydst ];
  }
);
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Map View
//------------------------------------------------------------------------------------------
var zoom = 1;
var mapCenter = transform([0,0], projection49901, projection49911);

var mainview = new View({
  center: mapCenter,
  zoom: zoom,
  maxZoom: 19,
  constrainResolution: true,
  //extent: [4504877, 1007670, 4741975, 1185493],
  // extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
//  extent: [-10668848.652, -15215881.563, 10668848.652, 15215881.563],
  extent: [-92160000, -46080000, 92160000, 46080000],
  // extent: [-20668848.652, -15215881.563, 20668848.652, 15215881.563],
  projection: projection49911,
  //maxResolution: 0.3179564670324326
  // multiWorld: true,
})
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Controls
//------------------------------------------------------------------------------------------
// Mouse Position
var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(3),
  projection: projection49901
});

// Legend
class LegendControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const element = document.createElement("div");
    element.className = "legend ol-unselectable ol-control";
    // element.appendChild(document.getElementById("legend"));

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    const tr = document.createElement("tr");
    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    super({
      element: element,
      target: options.target
    });
  }
}
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Layers
//------------------------------------------------------------------------------------------
// PR Targets

// Function: Assigning a layer to the features of a VectorSource
var addPRTarget = function (feature){
  var id = feature.get('id');
  feature.setId(id);
  feature.setProperties({
    'layer': 'pr_targets_lay'
  });
}

// Read features from local (Geo)JSON file (path):
const data = require('../assets/pr_targets.json');
var geojsonObject = data;

// Vector Source
var pr_targets_source = new VectorSource({
  features: new GeoJSON().readFeatures(geojsonObject)
}); 
pr_targets_source.forEachFeature(addPRTarget);

// Styles
var pr_styleFeature = new Style({
  text: new Text({
    text: '\uf111', // fa-circle
    font: '900 15px "Font Awesome 5 Free"',
    textBaseline: 'bottom',
    fill: new Fill({
      color: 'white'
    }),
    stroke: new Stroke({
      color: 'black',
      width: 4,
    })
  })
});
var pr_styleFeature_special = new Style({
  text: new Text({
    text: '\uf005', // fa-star
    font: '900 15px "Font Awesome 5 Free"',
    textBaseline: 'bottom',
    fill: new Fill({
      color: 'green',
    }),
    stroke: new Stroke({
      color: 'black',
      width: 4,
    })
  })
});
var pr_styleFeature_movie = new Style({
  text: new Text({
    text: '\uf008', // fa-film
    font: '900 15px "Font Awesome 5 Free"',
    textBaseline: 'bottom',
    fill: new Fill({
      color: 'white'
    }),
    stroke: new Stroke({
      color: 'black',
      width: 4,
    })
  })
});
var pr_styleFeature_movie_special = new Style({
  text: new Text({
    text: '\uf008', // fa-film
    font: '900 15px "Font Awesome 5 Free"',
    textBaseline: 'bottom',
    fill: new Fill({
      color: 'green',
    }),
    stroke: new Stroke({
      color: 'black',
      width: 4,
    })
  })
});

var pr_targets_lay = new Vector({
  title: "PR Targets",
  source: pr_targets_source,
  //style: pr_styleFeature,
  style: function(feature, resolution) {
    if (feature.get('year') == currentYear) {
    // if (feature.get('year') > 2020) {
      if (feature.get('movie') == "x") {
        return pr_styleFeature_movie_special;
      }
      else {
        return pr_styleFeature_special;
      }
    }
    else {
      if (feature.get('movie') == "x") {
        return pr_styleFeature_movie;
      }
      else {
        return pr_styleFeature;
      }
    }
  },
});

//Dynamic layer group
var dynlyrgrp = new LayerGroup({
  fold: "close",
  title: 'Dynamic layer group'
})

// HRSC ND4a Footprints WFS
var hrsc4aNdWfs = new Vector({
	title: 'Level-4 single-strip images (archive)',
	infodoc: 'src/hrsc-nd4a.html',
//	visible: false,
  visible: true,
	type: 'query',
	validsrs: 'eqc sps nps',
//  validsrs: 'EPSG:49910',
	opacity: 0.5,
    transparent: true,
    source: new VectorSource({
        wrapX: false
    }),
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(0,0,0, 1.0)',
            width: 1
        }),
		fill: new Fill({
         color: 'rgba(255,255,255,1)'
       })
    }),
});

var allHrsc4aNdWfs = new Vector({
  title: 'Level-4 single-strip images (archive) [SELECTABLE]', // 'title' parameter is necessary to be able to make the layer (in-)visible
//  visible: false,
  source: new VectorSource({
    wrapX: false
  })
});

var hrsc4aNdWfsSelection = new Vector({
  title: 'Selection', // 'title' parameter is necessary to be able to make the layer (in-)visible
//  visible: false,
  source: new VectorSource({
    wrapX: false
  }),
  style: highlightStyle,
});

var initHrsc4a = function(){
	allHrsc4aNdWfs.getSource().clear();
    var queryLayer='';
    var featureRequest = new WFS().writeGetFeature({
        featureNS: 'https://maps.planet.fu-berlin.de/eqc-bin/wms?',
        featureTypes: ['hrsc4and'],
        outputFormat: 'geojson',
        srsName: 'EPSG:49910',
        maxFeatures: 10000,
        filter: andFilter(
          lessThanOrEqualToFilter('stop_time', stopYear + '-01-01T00:00:00.000Z'),
          greaterThanOrEqualToFilter('start_time', startYear + '-01-01T00:00:00.000Z'),
        ),
    });
    fetch('https://maps.planet.fu-berlin.de/eqc-bin/wms?', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
        var features = new GeoJSON().readFeatures(json);
        allHrsc4aNdWfs.getSource().addFeatures(features);
        console.dir(features.length + ' HRSC4a sequences retrieved.');

        refreshLevel4a();
      }).catch(function(err) {
          console.dir(err);
    });
}

var refreshLevel4a = function() {
	hrsc4aNdWfs.getSource().clear();
	var inciMin=0;
        allHrsc4aNdWfs.getSource().forEachFeature(function(feature){
    	var scale=feature.getProperties().map_scale;
    	var ls=feature.getProperties().ls;
      var starttime=new Date('2009-01-01T00:00:00.000Z');
    	var stoptime=new Date('2013-01-01T00:00:00.000Z');


    	if (parseFloat(feature.getProperties().stopinci)>parseFloat(feature.getProperties().startinci)) {
    		var inci=[parseFloat(feature.getProperties().startinci),parseFloat(feature.getProperties().stopinci)];
    	} else {
    		var inci=[parseFloat(feature.getProperties().stopinci),parseFloat(feature.getProperties().startinci)];
    	}
    	var minltst=new Date('1970-01-01T'+feature.getProperties().minltst+'Z');
    	var maxltst=new Date('1970-01-01T'+feature.getProperties().maxltst+'Z');
    	// if ((app.selMaxRes != app.maxRes) && (scale > app.selMaxRes)) {
			// return null;
    	// }
    	// if ((app.selMinRes != app.minRes) && (scale < app.selMinRes)) {
			// return null;
    	// }
    	// if ((app.selMaxLs != app.maxLs) && (ls > app.selMaxLs)) {
			// return null;
    	// }
    	// if ((app.selMinLs != app.minLs) && (ls < app.selMinLs)) {
			// return null;
    	// }
    	// if ((stoptime < app.startTime ) || (starttime > app.stopTime)) {
    	// 	return null;
    	// }
    	// if ((maxltst < app.startLocalTime ) || (minltst > app.stopLocalTime)) {
    	// 	return null;
    	// }
    	// if ((inci[1] < app.inci[0] ) || ( inci[0] > app.inci[1] && app.inci[1] != app.timePanel.inciSlider.getAttribute('max') ) ) {
    	// 	return null;
    	// }
    	// if (inci[0]>inciMin) {
    	// 	inciMin=inci[0];
    	// }
    	hrsc4aNdWfs.getSource().addFeature(feature);
    });
    console.dir(hrsc4aNdWfs.getSource().getFeatures().length + ' HRSC4a sequences loaded.');
}



var remlyrsfunc = function() {
  // map.removeLayer(lay01);
  
  selected = [];
  dynlyrgrp.set('title', 'Dynamic layer group (' + selected.length + ')');
  dynlyrgrp.getLayers().clear();
  hrsc4aNdWfsSelection.getSource().clear();
  LayerSwitcher.renderPanel(map, toc, { reverse: true });
}
//Define remlyrs button onclick action
//var remlyrstab = document.getElementById('remlyrstab');
var remlyrsbtn = document.getElementById('remlyrsbtn');
remlyrsbtn.onclick=function() {
  remlyrsfunc();
};

var downloadlyrsfunc = function() {
  map.addLayer(lay01);
  map.addLayer(lay02);
  map.addLayer(lay03);
  map.addLayer(lay04);
  map.addLayer(lay05);
  map.addLayer(lay06);
  map.addLayer(lay07);
  //map.setLayerIndex(lay01, 3);
  LayerSwitcher.renderPanel(map, toc, { reverse: true });
}
//Define downloadlyrs button onclick action
//var downloadlyrstab = document.getElementById('downloadlyrstab');
var downloadlyrsbtn = document.getElementById('downloadlyrsbtn');
downloadlyrsbtn.onclick=function() {
  downloadlyrsfunc();
};


//Define selectlyrs button onclick action
var selectlyrsbtn = document.getElementById('selectlyrsbtn');
var selectlyrsbtn_clicked = false;

selectlyrsbtn.onclick=function() {
  if (selectlyrsbtn_clicked == false) {
    selectlyrsbtn_clicked = true;
    selectlyrsbtn.style.backgroundColor = "rgba(0,60,136,0.7)";
  } else {
    selectlyrsbtn_clicked = false;
    selectlyrsbtn.style.backgroundColor = "#0074d9";
  }
};
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Overlays
//------------------------------------------------------------------------------------------
// Elements that make up the popup
const container = document.getElementById('popup');
//  const content = document.getElementById('popup-content');
const content = document.createElement('div');
const closer = document.getElementById('popup-closer');
 
// Create an overlay to anchor the popup to the map
const overlay = new Overlay({
  element: container,
});

const element = overlay.getElement();

/**
* Add a click handler to hide the popup.
* @return {boolean} Don't follow the href.
*/
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Map
//------------------------------------------------------------------------------------------
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      title: "MOLA hill-shaded gray",
      type: 'base',
      visible: true,
      //source: new TileWMS({
      //  url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
      //  params: { LAYERS: "base-dtm" }
      //})
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc/wms?",
        params: { LAYERS: "MOLA-gray-hs" }
      })
    }),
    new TileLayer({
      title: "Topography",
      type: 'base',
      visible: false,
      //source: new TileWMS({
      //  url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
      //  params: { LAYERS: "base-dtm" }
      //})
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc/wms?",
        // params: { LAYERS: "HRSC-single-dtms" }
        params: { LAYERS: "MOLA-color-hs" }
      })
    }),
    new TileLayer({
      title: "Colour image map",
      opacity: 1,
      type: 'base',
      visible: false,
      //source: source
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc/wms?",
        params: { LAYERS: "HMChsvlog" }
      })
    }),

    pr_targets_lay,

    new TileLayer({
      title: "Nomenclature",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc-bin/wms?",
        params: { 
          LAYERS: "nomenclature"
       }
      })
    }),
    // new TileLayer({
    //   title: "Landingsites",
    //   source: new TileWMS({
    //     url: "https://maps.planet.fu-berlin.de/eqc-bin/wms?",
    //     params: { 
    //       LAYERS: "landingsites"
    //    }
    //   })
    // }),

    // allHrsc4aNdWfs,
    hrsc4aNdWfs,
    hrsc4aNdWfsSelection,
    
    

    dynlyrgrp,
  ],
  controls: defaultControls().extend([
    new LegendControl(),
    new ScaleLine({
      units: "metric",
      minWidth: 125
    }),
    new FullScreen({
      source: 'fullscreen',
    }),
    mousePositionControl,
    new ZoomToExtent({label: 'O', extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563]})
  ]),
  overlays: [overlay],
  view: mainview
});
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Sidebar
//------------------------------------------------------------------------------------------
var sidebar = new Sidebar({
  element: 'sidebar',
  position: 'left'
});
map.addControl(sidebar);
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Layer Switcher
//------------------------------------------------------------------------------------------
var toc = document.getElementById('layers');
LayerSwitcher.renderPanel(map, toc, { reverse: true });
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// Map Events
//------------------------------------------------------------------------------------------
// Event Function
var displayFeatureInfo = function (evt, pixel) {
  tooltip.style.left = pixel[0] + 'px';
  tooltip.style.top = (pixel[1] - 50) + 'px';
  var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature) {
    if (typeof feature.get('layer') === 'undefined') {
      //console.dir(feature);
    } else { 
      if (feature.get('layer') == 'pr_targets_lay') {  
        currentFeature=feature;
        mapdiv.style.cursor = "pointer";

        const coordinate = evt.coordinate;
        const hdms = toStringHDMS(toLonLat(coordinate));
        overlay.setPosition(coordinate);

        let popover = bootstrap.Popover.getInstance(element);
        
        content.innerHTML = '';
        
        //------------------------------------------------------------------------------------------
        // Variables
        var valPRdate = new Date(feature.get('pr_date'));
        var valDateString = dateformat(valPRdate, 'mmmm dd, yyyy');
        var valPRdecription_long = feature.get('desc_long');
        var valPRname = feature.get('name');
        var valPRsight_name = camelCase(valPRname);
        
        var valDirPath = 'https://maps.planet.fu-berlin.de/pr/' + 
          feature.get('year') +
          '\\' +
          feature.get('release_nr') +
          '_';
        if (feature.get('movie') == 'x'){
          valDirPath = valDirPath + 'movie';
          valPRsight_name = valPRsight_name.replace('Animation', '');
        } else if (feature.get('orbit') == 0) {
          valDirPath = valDirPath + 'mosaic';
        } else if (feature.get('orbit') > 9999){
          valDirPath = valDirPath + feature.get('orbit').toString();
        } else {
          valDirPath = valDirPath + feature.get('orbit').toString().padStart(4, '0');
        }
        //------------------------------------------------------------------------------------------
        
        //------------------------------------------------------------------------------------------
        // Popup elements declaration
        var popup_h1 = document.createElement('H1');
        var popup_p_01 = document.createElement('p');
        var popup_date = document.createTextNode(valDateString);
        var popup_span_01 = document.createElement('span');
        var popup_preview_image_div = document.createElement("div");
        var popup_preview_image_img = document.createElement('img');
        var popup_p_02 = document.createElement('p');
        var popup_release_webpage_a = document.createElement('a');
        var popup_release_webpage_i = document.createElement('i');
        var popup_span_02 = document.createElement('span');
        var popup_p_03 = document.createElement('p');
        var popup_description_long = document.createTextNode(valPRdecription_long);
        var popup_span_03 = document.createElement('span');
        var popup_products_tbl = document.createElement('table');
        var popup_products_tbdy = document.createElement('tbody');
        var popup_products_tr_01 = document.createElement('tr');
        var popup_products_th = document.createElement('th');
        var popup_products_tr_02 = document.createElement('tr');
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        // Styling elements
        popup_h1.style.fontWeight = '900';
        popup_h1.style.paddingBottom = '20pt';
        popup_h1.style.paddingTop = '20pt';
        popup_h1.style.paddingLeft = '10pt';
        popup_h1.style.paddingRight = '10pt';
        popup_h1.style.color = 'white';
        popup_h1.setAttribute('align', 'center');
        popup_span_01.style.fontWeight = 'bold';
        popup_span_01.style.paddingRight = '10pt';
        popup_preview_image_div.style.textAlign = "center";
        popup_preview_image_div.style.backgroundColor = "black";
        popup_preview_image_img.setAttribute('height', '180');
        popup_preview_image_img.setAttribute('align', 'center');
        popup_p_02.style.fontWeight = 'bold';
        popup_products_tbl.style.width = '100%';
        popup_products_tbl.style.borderSpacing = "10px";    
        popup_products_th.style.fontWeight = '800';
        popup_products_th.style.paddingBottom = '5pt';
        popup_products_th.style.paddingTop = '5pt';
        popup_products_th.style.backgroundColor='rgba(180, 180, 180, 0.3)';
        //------------------------------------------------------------------------------------------
          
        //------------------------------------------------------------------------------------------
        // Popup Title
        popup_h1.appendChild(document.createTextNode(feature.get('name')));
        content.appendChild(popup_h1);
        //------------------------------------------------------------------------------------------
        
        content.appendChild(popup_p_01);
        popup_span_01.appendChild(popup_date);
        popup_p_01.appendChild(popup_span_01);
        
        //------------------------------------------------------------------------------------------
        // Description short
        if (feature.get('desc_short') != null) {
          popup_p_01.appendChild(document.createTextNode(feature.get('desc_short')));  
        }
        //------------------------------------------------------------------------------------------
        //------------------------------------------------------------------------------------------
        // Press Release dir path
        valDirPath = valDirPath +
          '_' +
          valPRsight_name +
          '\\jpg\\';
        //------------------------------------------------------------------------------------------
        
        //------------------------------------------------------------------------------------------
        // Preview image
        if (feature.get('fn_co') != null) {
          var valImgSrc = valDirPath + 
          feature.get('fn_co').split(".")[0] +
          '.jpg';
        }  
      
        if (LinkCheck(valImgSrc)) {
          popup_preview_image_img.setAttribute('src', valImgSrc);
          // if (document.querySelector("img").naturalWidth < document.querySelector("img").naturalHeight) {
          //   popup_preview_img.setAttribute('height', '180'); 
          // } else {
          //   // popup_preview_img.setAttribute('width', '100%');
          //   popup_preview_img.setAttribute('width', '275');
          // }
          popup_preview_image_div.appendChild(popup_preview_image_img);
          content.appendChild(popup_preview_image_div);
        }
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        // Link to Press Release webpage
        popup_release_webpage_a.setAttribute('class', 'btn');
        popup_release_webpage_a.setAttribute('href', feature.get('url_pr'));
        popup_release_webpage_i.setAttribute('class', 'fas fa-external-link-square-alt');
        popup_release_webpage_a.appendChild(popup_release_webpage_i);
        popup_span_02.appendChild(popup_release_webpage_a);
        popup_p_02.appendChild(document.createTextNode('Press Release page: '));
        popup_p_02.appendChild(popup_span_02);
        content.appendChild(popup_p_02)
        //------------------------------------------------------------------------------------------
        
        //------------------------------------------------------------------------------------------
        // Description long
        if (valPRdecription_long != null) {
          popup_span_03.appendChild(popup_description_long);
        }
        popup_p_03.appendChild(popup_span_03);
        content.appendChild(popup_p_03);
        //------------------------------------------------------------------------------------------

        //------------------------------------------------------------------------------------------
        // Products - Table with links  
        popup_products_th.setAttribute('colSpan', '7');
        popup_products_th.appendChild(document.createTextNode('Products'));
        popup_products_tr_01.appendChild(popup_products_th);
        popup_products_tbdy.appendChild(popup_products_tr_01);

        for (var i = 0; i < product_types.length; i++) {
          var popup_products_td = document.createElement('td');        
          if (feature.get('fn_' + product_types[i]) != null) {
            popup_products_td.setAttribute('class', 'popup-product-btns-active');
            var popup_products_a = document.createElement('a');
            popup_products_a.style.color = 'white';
            popup_products_a.style.textDecoration = 'none';
            
            var valImgSrc = valDirPath +
              feature.get('fn_' + product_types[i]).split(".")[0] +
              '.jpg';
            popup_products_a.setAttribute('href', valImgSrc);
            popup_products_td.setAttribute('title', product_types_desc[i]);
            popup_products_a.appendChild(document.createTextNode(product_types[i].toUpperCase()));
            popup_products_td.appendChild(popup_products_a);
          } else {
            popup_products_td.setAttribute('class', 'popup-product-btns-inactive');
            popup_products_td.setAttribute('title', product_types_desc[i]);
            popup_products_td.appendChild(document.createTextNode(product_types[i].toUpperCase()));
          }
          popup_products_tr_02.appendChild(popup_products_td);
        }
      
        popup_products_tbdy.appendChild(popup_products_tr_02);
        popup_products_tbl.appendChild(popup_products_tbdy);
        content.appendChild(popup_products_tbl);
        //------------------------------------------------------------------------------------------
        
        if (popover) {
          popover.dispose();
        }
        popover = new bootstrap.Popover(container, {  
          animation: false,
          container: container,
          content: content,
          html: true,
          placement: "right",
          trigger: "focus",
        });
        content.setAttribute('class', 'olpopup');
        popover.show();
      }
    }
  } else {
    if (currentFeature) {
      overlay.setPosition(undefined);
      closer.blur();
    };
    tooltip.style.display = 'none';
    mapdiv.style.cursor = "";
  }
};

const delay = function (milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

// const cycleLayers = async function (layer) {
const cycleLayers = async function() {
  var cycleTime = document.getElementById("cycletime").value;
  var layers = dynlyrgrp.getLayers().getArray();
  for (var i = 0; i < layers.length; i++) {
    layer = layers[i];
    // cycleLayers(layer);
    layer.setVisible(true);
    await delay(1000*cycleTime);
    layer.setVisible(false);
    console.log(layer.get('title'));
  }
};
// document.getElementById("cyclelyrsbtn").on("click", cycleLayers());
var cyclelyrsbtn = document.getElementById("cyclelyrsbtn");
cyclelyrsbtn.onclick = function() {
  dynlyrgrp.setVisible(true);
  dynlyrgrp.getLayers().forEach(layer => layer.setVisible(false));
  cycleLayers();
};


// Events
map.on('click', function (event) {
  if (event.dragging) {
    tooltip.style.display = 'none';
    return;
  }
  displayFeatureInfo(event, map.getEventPixel(event.originalEvent));
});

map.on('loadstart', function (event) {
  initHrsc4a();
})

//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Controls outside the map object
//------------------------------------------------------------------------------------------
// Slider control: Set one value for the year in the stopDate string

$("#slider").roundSlider({
  sliderType: "range",
  handleShape: "round",
  value: "2006,2020",
  circleShape: "pie",
  width: 18,
  radius: 70,
  startAngle: 45,
  max: "2022",
  min: "2004",
  lineCap: "round",
  showTooltip: false,
  mouseScrollAction: true
});

$("#slider").on("drag change", function(e) {
  startYear = e.value.split(",")[0];
  stopYear = e.value.split(",")[1];
  $("#sliderValMin").text(startYear);
  $("#sliderValMax").text(stopYear);
  initHrsc4a();
});
//------------------------------------------------------------------------------------------



// //------------------------------------------------------------------------------------------
// // Source: https://openlayers.org/en/latest/examples/select-multiple-features.html
// //------------------------------------------------------------------------------------------

const highlightStyle = new Style({
  fill: new Fill({
    // color: '#EEE',
    color: '#32ff4d2f',
  }),
  stroke: new Stroke({
    // color: '#3399CC',
    color: '#006e0f',
    width: 2,
  }),
});

var selected = [];

const status = document.getElementById('status');

map.on('singleclick', function (e) {
  if (selectlyrsbtn_clicked) {
    map.forEachFeatureAtPixel(e.pixel, function (f) {
      wfsProductid = f.get('source_product_id');
      
      const selIndex = selected.indexOf(f);
      if (selIndex < 0) {
        selected.push(f);
        // f.setStyle(highlightStyle);
  
        
        var tmpTile = new TileLayer({
          title: wfsProductid,
          opacity: 1,
          visible: false,
          source: new TileWMS({
            url: "https://maps.planet.fu-berlin.de/eqc/wms?",
            params: { 
              LAYERS: "hrsc4",
              VERSION: '1.3.0',
              TILED: true,
              PRODUCTID: wfsProductid,
            }
          })
        });
        
        dynlyrgrp.getLayers().push(tmpTile);
        dynlyrgrp.set('title', 'Dynamic layer group (' + selected.length + ')');
  
  
        hrsc4aNdWfsSelection.getSource().clear();
        hrsc4aNdWfsSelection.getSource().addFeatures(selected);
      
  
        LayerSwitcher.renderPanel(map, toc, { reverse: true });
      } else {
        selected.splice(selIndex, 1);
        console.log(selected);
        
        // f.setStyle(undefined);
  
  
        var dynlyrs = dynlyrgrp.getLayers().getArray();
    
        dynlyrgrp.getLayers(dynlyrs.find(layer => layer.get('title') == wfsProductid)).pop();
        
        dynlyrgrp.set('title', 'Dynamic layer group (' + selected.length + ')');
          
        hrsc4aNdWfsSelection.getSource().clear();
        hrsc4aNdWfsSelection.getSource().addFeatures(selected);
      
  
        LayerSwitcher.renderPanel(map, toc, { reverse: true });
      }
    });
  
    status.innerHTML = '&nbsp;' + selected.length + ' selected features';
  }
});

//------------------------------------------------------------------------------------------