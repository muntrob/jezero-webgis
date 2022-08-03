import 'ol/ol.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
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

//import * as THREE from 'three';
//import * as PANOLENS from 'panolens';
import  AFRAME from 'aframe';

import './jezero.css';



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
//roverCoords=[77.45081155,18.44467749]
proj4.defs("EPSG:49901", "+proj=longlat +R=3396190 +no_defs");
proj4.defs("EPSG:49910", "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R=3396190 +units=m +no_defs");
proj4.defs("EPSG:49911", "+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +R=3396190 +units=m +no_defs");
register(proj4);
//https://maps.planet.fu-berlin.de/jez-bin/wms?
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
    //console.log(vertices);
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
  extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
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

//addCoordinateTransforms(
//  projection49910,
//  projection49911,
//  function (coordinate) {
//    var xdst=3396190*(coordinate[0]/180*Math.PI);
//    var ydst=3396190*(coordinate[1]/180*Math.PI);
//    return [ xdst, ydst ];
//  },
//  function (coordinate) {
//    var xdst=(coordinate[0]*180/Math.PI)/3396190;
//    var ydst=(coordinate[1]*180/Math.PI)/3396190;
//    return [ xdst, ydst ];
//  }
//);
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

////var zoom = 14;
var zoom = 8;
var mapCenter = transform([77.4565,18.4475], projection49901, projection49911);
//var mapCenter = transform([77.6790,18.4022], projection49901, projection49911);
var rotation = 0;

var mainview = new View({
    center: mapCenter,
    zoom: zoom,
    //minZoom: 9,
    minZoom: 2,
    maxZoom: 19,
    constrainResolution: true,
    //extent: [4504877, 1007670, 4741975, 1185493],
    extent: [-10668848.652, -5215881.563, 10668848.652, 5215881.563],
    projection: projection49911,
    //maxResolution: 0.3179564670324326
  })

var source = new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez/?",
        params: { LAYERS: "base-hsv" }
      });
source.on('tileloadend', function () {
  //console.log(mainview.calculateExtent());
  //console.log(mainview.getZoom());
  //coord = transform([35,0], projection49901, projection49911);
  //llcoord = transform(coord, 'EPSG:49911', 'EPSG:49901');
  //console.log(llcoord);
  var reso = mainview.getResolution();
  var scale = 39.37 * 72 * reso;
  //console.log(scale);
  //var scaledenom=(reso *)
  //console.log(mainview.getCenter());
});

var mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(3),
  projection: projection49901
});
class Panorama {
  constructor(feature) {
    this.id=feature.get('id');
    this.name=feature.get('name');
    this.image=feature.get('panorama');
    //console.dir(this.image);
    if (feature.get('rotation') === undefined) {
      feature.set('rotation','0 0 0');
    }
    this.rotation=feature.get('rotation');
    if (feature.get('icon') === undefined) {
      feature.set('icon','map-marker-alt');
    }
    this.icon=feature.get('icon');
    this.credits=feature.get('credits');
    this.infos=[];
  }
}
var addPano=function(feature){
  var id = feature.get('id');
  feature.setId(id);
  feature.setProperties({
    'layer': 'poi'
  });
  panos[id] = new Panorama(feature);
}
var currentPano=-1;
var panos = [];
var ll2xyz = function(coordinates){
  var xyz = transform(coordinates, projection49901, projection49911);
  return xyz;
}
var featuresAsText='{"type":"FeatureCollection","features":[\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.45081155,18.44467749]).toString()+']},"properties":{"id":"6","name":"Perseverance landing site","icon":"parachute-box","link":"","content":"","zoom":"14","panorama":"jpegPIA24264","rotation":"0 60 0","credits":"Mars 2020/Mastcam-Z/PIA24264, NASA/JPL/ASU/MSSS"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":[4632176.210556282,1074653.2601958876]},"properties":{"id":"5","name":"Mountain view","link":"","content":"","zoom":"12","panorama":"Camera9_Mountain_2","rotation":"-20 80 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.46,18.530]).toString()+']},"properties":{"id":"1","name":"Delta basement","link":"","content":"","zoom":"14","panorama":"Camera5_inflow_spheric2","rotation":"-10 120 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.358,18.508]).toString()+']},"properties":{"id":"2","name":"Delta top","link":"","content":"","zoom":"14","panorama":"Camera5_delta_spheric2","rotation":"-30 240 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":[4629228.058937868,1098332.5630884669]},"properties":{"id":"0","name":"Outflow channel","link":"","content":"","zoom":"12","panorama":"Camera8_outflow_2_spheric","rotation":"-20 -80 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":[4580081.744192608,1096482.1274981857]},"properties":{"id":"3","name":"Neretva Vallis","link":"","content":"","zoom":"12","panorama":"Camera4_inflow_spheric3","rotation":"-20 90 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.564, 18.769]).toString()+']},"properties":{"id":"7","name":"Sava Vallis","link":"","content":"","zoom":"10","panorama":"Camera13_inflow_2_spheric","rotation":"-20 90 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.688, 18.396]).toString()+']},"properties":{"id":"4","name":"Jezero crater center","link":"","content":"","zoom":"9","panorama":"Camera15_center_crater","rotation":"-30 100 0","credits":"HiRISE/CTX/HRSC"}},\
  {"type":"Feature","geometry":{"type":"Point","coordinates":['+ll2xyz([77.302, 18.554]).toString()+']},"properties":{"id":"8","name":"Paleo lake view","link":"","content":"","zoom":"13","panorama":"paleo_lake_view","rotation":"-30 100 0", "credits":"HiRISE/CTX/HRSC"}}\
  ]}';
//HIER AUCH BESSER PROJEKTIONEN DIREKT EINGEBEN
var poiSource = new VectorSource({
  features: new GeoJSON().readFeatures(featuresAsText)
});
poiSource.forEachFeature(addPano);
var styleFeature = new Style({
    text: new Text({
      text: '\uf041',
      font: '900 24px "Font Awesome 5 Free"',
      textBaseline: 'bottom',
      fill: new Fill({
        color: 'white'
      })
    })
  });

var poi = new Vector({
  title: "Panoramic views",
  source: poiSource,
  style: styleFeature,
  minZoom: 8
});

// ROVER TRACK
var track = new Vector({
  title: "Perseverance track",
  visible: true,
  style: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 1.5,
    })
  })
});
var trackxhr = new XMLHttpRequest();
trackxhr.open('GET', 'https://maps.planet.fu-berlin.de/jezero/roverpath.geojson');
trackxhr.onload = function() {
 if (trackxhr.status == 200) {
   var trackFeatures = new GeoJSON().readFeatures(trackxhr.responseText, {
        dataProjection: projection49901,
        featureProjection: projection49911
        });
   track.setSource( new VectorSource({
      features: trackFeatures
      })
   );
   } else {
     console.dir("error loading perseverance track.");
   }
}
trackxhr.send();
//ROVER WAYPOINTS AND POSITION
var rover = new Vector({
  title: "Current rover position",
  visible: true,
  style: new Style({
    text: new Text({
      text: '\uf067',
      font: '900 24px "Font Awesome 5 Free"',
      textBaseline: 'bottom',
      fill: new Fill({
        color: 'white'
      })
    })
  })
});
var way = new Vector({
  title: "Rover waypoints",
  visible: true,
  symbol: new Circle({
    radius: 120,
    fill: new Fill({
      color: 'white'
    })
  })
});
var wayxhr = new XMLHttpRequest();
wayxhr.open('GET', 'https://maps.planet.fu-berlin.de/jezero/Waypoints.geojson');
wayxhr.onload = function() {
 if (wayxhr.status == 200) {
   //console.dir(xhr.responseText);
   var wayFeatures = new GeoJSON().readFeatures(wayxhr.responseText, {
        dataProjection: projection49901,
        featureProjection: projection49911
        });
   way.setSource( new VectorSource({
      features: wayFeatures
      })
   );
   way.getSource().forEachFeature(function(feature){
    feature.setProperties({
      'layer': 'way'
    });
   });
   var lastPoint = wayFeatures[wayFeatures.length - 1];
   lastPoint.setProperties({
     'layer': 'rover',
     'name': 'Current rover position'
   })
   rover.setSource( new VectorSource({
      features: [lastPoint]
      })
   );
   } else {
     console.dir("error loading perseverance waypoints.");
   }
}
wayxhr.send();

var lay01 = new TileLayer({
  title: "Orthorectified image 01",
  visible: true,
  source: new TileWMS({
    //url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    url: "https://maps.planet.fu-berlin.de/eqc-bin/productid.py?",
    params: { 
      LAYERS: "hrsc4ihs",
      PRODUCTID: "h0988_0000.ihs.07"
   }
  })
});
var lay02 = new TileLayer({
  title: "Orthorectified image 02",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4ihs",
      PRODUCTID: "h2228_0002.ihs.06"
   }
  })
});
var lay03 = new TileLayer({
  title: "Orthorectified image 03",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4ihs",
      PRODUCTID: "h5270_0000.ihs.06"
   }
  })
});
var lay04 = new TileLayer({
  title: "Orthorectified image 04",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4",
      PRODUCTID: "h7289_0000.nd4.08"
   }
  })
});
var lay05 = new TileLayer({
  title: "Orthorectified image 05",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4",
      PRODUCTID: "hd618_0000.nd4.03"
   }
  })
});
var lay06 = new TileLayer({
  title: "Orthorectified image 06",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4",
      PRODUCTID: "hj848_0000.nd4.03"
   }
  })
});
var lay07 = new TileLayer({
  title: "Orthorectified image 07",
  visible: true,
  source: new TileWMS({
    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    params: { 
      LAYERS: "hrsc4",
      PRODUCTID: "hj989_0000.nd4.04"
   }
  })
});

var lyrgrp01 = new LayerGroup({
  title: 'Orthorectified images',
  layers: [
    lay01,
    lay02,
    lay03
  ]
})

var lyrgrp02 = new LayerGroup({
  title: 'Orthorectified images',
  layers: [
    lay04,
    lay05,
    lay06
  ]
})

//
// Define rotate to north control.
//

class RotateNorthControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = 'N';

    const element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleRotateNorth.bind(this), false);
  }

  handleRotateNorth() {
    //this.getMap().getView().setRotation(0);
    this.getMap().removeLayer(lay01);
  }
}

/* HRSC Level 4 Highlight layer*/
var Hrsc4Highlight = new Vector({
	type: 'selection',
	target: 'hrsc4',
    visible: true,
    renderBuffer: 0,
    source: new VectorSource(),
    style: new Style({
        stroke: new Stroke({
            color: 'rgba(255,255,255, 1.0)',
            width: 1
        })
    })
});


/* HRSC ND4 Footprints WFS*/
var hrsc4NdWfs = new Vector({
	title: 'Level-4 single-strip images (prelim.)',
	infodoc: 'src/hrsc-nd4.html',
	visible: false,
	type: 'query',
	validsrs: 'sps eqc nps',
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



//hrsc4NdWfs.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
//  Hrsc4Highlight.getSource().addFeature(feature);
//})
//hrsc4NdWfs.getSource().forEachFeature(function(feature) {
//  Hrsc4Highlight.getSource().addFeature(feature);
//});




const map = new Map({
  target: 'map',
  layers: [
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
        params: { LAYERS: "HRSC-single-dtms" }
      })
    }),
    new TileLayer({
      title: "Colour image map",
      opacity: 1,
      type: 'base',
      visible: true,
      //source: source
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc/wms?",
        params: { LAYERS: "HMChsvlog" }
      })
    }),
    //new TileLayer({
    //  title: "Orthorectified image 01",
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4ihs",
    //      PRODUCTID: "h0988_0000.ihs.07"
    //   }
    //  })
    //}),
    
    //lay01,
    //lay02,
    //lay03,
    //lay04,
    //lay05,
    //lay06,
    //lay07,

    lyrgrp01,
    lyrgrp02,

    Hrsc4Highlight,
    hrsc4NdWfs,
    
    //new TileLayer({
    //  title: "Orthorectified image 01",
    //  source: new TileWMS({
    //    //url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    url: "https://maps.planet.fu-berlin.de/eqc-bin/productid.py?",
    //    params: { 
    //      LAYERS: "hrsc4ihs",
    //      PRODUCTID: "h0988_0000.ihs.07"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 02",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4ihs",
    //      PRODUCTID: "h2228_0002.ihs.06"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 03",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4ihs",
    //      PRODUCTID: "h5270_0000.ihs.06"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 04",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4",
    //      PRODUCTID: "h7289_0000.nd4.08"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 05",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4",
    //      PRODUCTID: "hd618_0000.nd4.03"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 06",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4",
    //      PRODUCTID: "hj848_0000.nd4.03"
    //   }
    //  })
    //}),
    //new TileLayer({
    //  title: "Orthorectified image 07",
    //  visible: false,
    //  source: new TileWMS({
    //    url: "https://maps.planet.fu-berlin.de/eqc/wms?",
    //    params: { 
    //      LAYERS: "hrsc4",
    //      PRODUCTID: "hj989_0000.nd4.04"
    //   }
    //  })
    //}),
    new TileLayer({
      title: "Contour lines",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez/?",
        params: { 
          LAYERS: "contour"
       }
      })
    }),
    new TileLayer({
      title: "In-/out-flow channels",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
        params: { LAYERS: "channels" }
      })
    }),
    new TileLayer({ 
      title: "Possible paleo lake-level",
      visible: false,
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
        params: { LAYERS: "lake" }
      }),
    }),
    new TileLayer({
      title: "Landing ellipse",
      visible: false,
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
        params: { LAYERS: "landingellipse" }
      }),
    }),
    poi,
    rover,
    track,
    way,
    new TileLayer({
      title: "Nomenclature",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc-bin/wms?",
        params: { 
          LAYERS: "nomenclature"
       }
      })
    }),
    new TileLayer({
      title: "Landingsites",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc-bin/wms?",
        params: { 
          LAYERS: "landingsites"
       }
      })
    }),
    new TileLayer({
      title: "Lat/Lon GRID",
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/jez-bin/wms?",
        params: { LAYERS: "grid" }
      })
    })
  ],
  controls: defaultControls().extend([
    new ScaleLine({
      units: "metric",
      //bar: true,
      //text: true,
      minWidth: 125
    }),
    new FullScreen({
      source: 'fullscreen',
    }),
    mousePositionControl,
    new ZoomToExtent({label: 'O', extent: [4471445.622758097, 953062.4788152642, 4734194.672506754, 1227858.2631868462]})//,
    //new RotateNorthControl({target: 'body'})
  ]),
  view: mainview
});

//var tst_button = new RotateNorthControl();
//map.addControl(tst_button);
//sidebar.addControl(tst_button);


var sidebar = new Sidebar({
  element: 'sidebar',
  position: 'left'
});
var toc = document.getElementById('layers');
LayerSwitcher.renderPanel(map, toc, { reverse: true });
map.addControl(sidebar);

var strokeBig = new Stroke({
       color: 'rgba(51,153,204,1)',
       width: 5
     });
var whiteFill=new Fill({
        color: 'rgba(255,255,255,1)'
      });
var cyanFill=new Fill({
        color: 'rgba(51,153,204,1)'
      });
var styleFeatureBig = new Style({
    text: new Text({
      text: '\uf041',
      font: '900 24px "Font Awesome 5 Free"',
      textBaseline: 'bottom',
      fill: new Fill({
        color: 'rgba(51,153,204,1)'
      })
    })
  });
var mapdiv = document.getElementById('map');
//var currentFeature = new Feature();
var displayFeatureInfo = function (pixel) {
  tooltip.style.left = pixel[0] + 'px';
  tooltip.style.top = (pixel[1] - 50) + 'px';
  var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature) {
    if (typeof feature.get('layer') === 'undefined') {
      //console.dir(feature);
    } else if (feature.get('layer') == 'poi') {
      //console.dir(feature.get('layer'));
      feature.setStyle();
      feature.setStyle(styleFeatureBig);
      currentFeature=feature;
      var text = feature.get('name');
      tooltip.style.display = 'none';
      tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      mapdiv.style.cursor = "pointer";
    } else if (feature.get('layer') == 'way') {
      var text = 'Sol '+feature.get('sol');
      tooltip.style.display = 'none';
      tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      //mapdiv.style.cursor = "pointer";
      //console.dir(feature.get('sol'));
    } else if (feature.get('layer') == 'rover') {
      var text = feature.get('name');
      tooltip.style.display = 'none';
      tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      //mapdiv.style.cursor = "pointer";
      //console.dir(feature.get('sol'));
    }
  } else {
    if (currentFeature) {
      currentFeature.setStyle();
      currentFeature.setStyle(styleFeature)
      currentFeature=null;
    };
    tooltip.style.display = 'none';
    mapdiv.style.cursor = "";
  }
};
map.on('pointermove', function (event) {
  if (event.dragging) {
    tooltip.style.display = 'none';
    return;
  }
  displayFeatureInfo(map.getEventPixel(event.originalEvent));
});
var currentFeature;
var returnToMap = function() {
  //disable map canvas
  var mapdiv = document.getElementById('map');
  mapdiv.classList.remove('hidden');
  //enable pano canvas
  var panodiv = document.getElementById('pano');
  panodiv.classList.add('hidden');
  //show layers tab pane
  var ltab = document.getElementById('ltab');
  ltab.classList.remove('hidden');
  //remove map tab pane
  var mtab = document.getElementById('mtab');
  mtab.classList.add('hidden');
  var vrtab = document.getElementById('vrtab');
  vrtab.classList.add('hidden');
  var vrtab = document.getElementById('fstab');
  fstab.classList.add('hidden');
  var sound=document.getElementById('insightsnd');
  var itab = document.getElementById('itab');
  itab.classList.add('disabled');
  var credits=document.getElementById('imagecredits');
  credits.children[0].innerHTML='';
  credits.classList.add('hidden');
  emptyInfotab();
  sound.pause();
  for (const pano of panos){
    let loopli=document.getElementById('pli-'+pano.id);
    loopli.classList.remove('selected');
  }
  mainview.animate({
    duration: 2000,
    zoom: previousZoom
  });
  //console.dir('dispose Pano');
  var asky=document.getElementById('panorama');
  asky.removeAttribute('src');
  tooltip.innerHTML='';
  tooltip.style.display = 'block';
}
var previousZoom;
var onClickFunction;
//Define map tab onclick action
var mapbutton = document.getElementById('mapbutton');
mapbutton.parentElement.onclick=function() {
  returnToMap();
};

// ---------------------------------------------------------------------------------
// Functionality: Cycle through a set/group of layers <- NOT YET WORKING !
// ---------------------------------------------------------------------------------

//var donothing = function (){console.log('after');}
//
//var cycleLyrs = function () {
//  lyrgrp01.forEach(element => {
//    map.getLayers(element).visibility = false;
//    setTimeout(donothing, 500);
//    console.log(element);
//  })
//};

//var cycleLyrs = function () {
//  LayerGroup.forEachRecursive(map, function(layer, idx, a) {
//    lyrgrp01.getLayers(layer).visibility = false;
//  });
//};
//
//var cyclelyrsbtn = document.getElementById('cyclelyrsbtn');
//cyclelyrsbtn.onclick=function() {
//  cycleLyrs();
//};
// ---------------------------------------------------------------------------------

var remlyrsfunc = function() {
  map.removeLayer(lay01);
  map.removeLayer(lay02);
  map.removeLayer(lay03);
  map.removeLayer(lay04);
  map.removeLayer(lay05);
  map.removeLayer(lay06);
  map.removeLayer(lay07);
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


var vrbutton = document.getElementById('vrbutton');
vrbutton.parentElement.onclick=function() {
  console.dir('nothing');
};
//var fullScreenState=false;
var fsbutton = document.getElementById('fsbutton');
fsbutton.parentElement.onclick=function() {
    var panodiv = document.getElementById('pano');
    panodiv.requestFullscreen();
};
function switchToPano(id) {
  //geht nicht aus popstate!
  changeInfotab(id);
  var asky=document.getElementById('panorama');
  asky.setAttribute('src','#'+panos[id].image);
  var credits=document.getElementById('imagecredits');
  credits.children[0].innerHTML='Image: '+panos[id].credits;
  credits.classList.remove('hidden');
  //console.dir(panos[id].name);
  //var acam=document.getElementById('camera');
  //acam.setAttribute('rotation',panos[id].rotation);
  //console.dir(asky.getAttribute('src'));
  //remove tooltip
  var tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
  var mapdiv = document.getElementById('map');
  mapdiv.classList.add('hidden');
  var panodiv = document.getElementById('pano');
  panodiv.classList.remove('hidden');
  panodiv.classList.add('visible');
  //remove layers tab pane
  var ltab = document.getElementById('ltab');
  ltab.classList.add('hidden');
  //show map tab pane
  var mtab = document.getElementById('mtab');
  mtab.classList.remove('hidden');
  mtab.style.cursor = "pointer";
  //activate info tab
  var itab = document.getElementById('itab');
  itab.classList.remove('disabled');
  itab.style.cursor = "pointer";
  //show VR button
  var vrtab = document.getElementById('vrtab');
  vrtab.classList.remove('hidden');
  vrtab.style.cursor = "pointer";
  //show FS button
  var fstab = document.getElementById('fstab');
  fstab.classList.remove('hidden');
  fstab.style.cursor = "pointer";
  var sound=document.getElementById('insightsnd');
  sound.play();
  currentPano=id;
}
var clickMap = function (pixel) {
  var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature) {
    if (typeof feature.get('layer') === 'undefined') {
      //console.dir(feature);
    } else if (feature.get('layer') == 'poi') {
      //console.dir(feature.getGeometry().getCoordinates());
      currentFeature=feature;
      var parts = 1;
      var called = false;
      function callback() {
        switchToPano(feature.get('id'));
      }
      previousZoom = mainview.getZoom();
      var zoom=feature.get('zoom');
      if ( zoom < 10) {
        //console.dir(zoom);
        zoom=10;
      }
      if (Math.abs(mainview.getCenter()[0]-previousCenter[0])>5000||Math.abs(mainview.getCenter()[1]-previousCenter[1])>5000) {
      mainview.animate({
          center: feature.getGeometry().getCoordinates(),
          duration: 2000,
          zoom: zoom,
        }, callback );
      } else {
        //console.dir('noanimate');
        switchToPano(feature.get('id'));
      }
    } 
  }
}
map.on('singleclick', function (event) {
  clickMap(map.getEventPixel(event.originalEvent));
})
var previousCenter=mainview.getCenter();
map.on('moveend', function (event) {
  //console.dir([Math.abs(mainview.getCenter()[0]-previousCenter[0]),Math.abs(mainview.getCenter()[1]-previousCenter[1])]);
})

//map.removeLayer(lay01);

var selectedLabel;
var renderPanViews = function() {
  var panoramas = document.getElementById('panoramas');
  var ul = document.createElement('ul');
  panoramas.appendChild(ul);
  for (const pano of panos){
    var li = document.createElement('li');
    li.id='pli-'+pano.id;
    var input = document.createElement('input');
    input.setAttribute('type','checkbox');
    input.disabled=true;
    input.style.visibility='hidden';
    li.appendChild(input);
    var label = document.createElement('label');
    label.innerHTML=pano.name;
    label.onclick=function(event) {
      for (const pano of panos){
        let loopli=document.getElementById('pli-'+pano.id);
        loopli.classList.remove('selected');
      }
      this.parentElement.classList.add('selected');
      var mapdiv=document.getElementById('map');
      var feature=poiSource.getFeatureById(pano.id);
      if (mapdiv.classList.contains('hidden')) {
        //inside pano, fist switch to map and zoom out
        sidebar.close();
        mapdiv.classList.remove('hidden');
        //disable pano canvas
        var panodiv = document.getElementById('pano');
        panodiv.classList.add('hidden');
        var asky=document.getElementById('panorama');
        asky.removeAttribute('src');
        var parts = 1;
        var called = false;
        function callback() {
          //geht nicht?
          //var delay = parts === 0 ? 0 : 1750;
          switchToPano(feature.get('id'));
        }
        if (mainview.getZoom()>11) {
          mainview.animate({
          //first zoom back out
            duration: 2000,
            zoom: 10,
          });
        }
        mainview.animate(
          {
            center: feature.getGeometry().getCoordinates(),
            zoom: feature.get('zoom')-1,
            duration: 2000          
          },
          {
            zoom: feature.get('zoom'),
            duration: 2000          
          },
          callback
        );
      } else {
        sidebar.close();
        var parts = 1;
        var called = false;
        function callback(complete) {
          switchToPano(feature.get('id'));
        }
        previousZoom = mainview.getZoom();
        var zoomTo=feature.get('zoom');
        //var viewZoom=view.getZoom();
        if ( mainview.getZoom()>11 ) {
          mainview.animate({
            duration: 2000,
            zoom: 10,
          });
        }
        mainview.animate(
        {
          center: feature.getGeometry().getCoordinates(),
          zoom: zoomTo-1,
          duration: 2000,
        },
        {
          duration: 2000,
          zoom: zoomTo,
        },
        callback
      );
      }
      
    }
    li.className = 'panorama';
    li.appendChild(label);
    ul.appendChild(li);
  }
}
renderPanViews();
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.wheelDelta);
    //getting the mouse wheel change (120 or -120 and normalizing it to 1 or -1)
    var mycam=document.getElementById('camera').getAttribute('camera');
    var finalZoom=document.getElementById('camera').getAttribute('camera').zoom+delta;
    //limiting the zoom so it doesnt zoom too much in or out
    if(finalZoom<1)
      finalZoom=1;
    if(finalZoom>5)
      finalZoom=5;  

    mycam.zoom=finalZoom;
    //setting the camera element
    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    if (!isFirefox) {
      document.getElementById('camera').setAttribute('camera',mycam);
    }
  });
var changeInfotab = function(id) {
  var tab = document.getElementById('infotext');
  tab.innerHTML=textarray[id];
};
var emptyInfotab = function(id) {
  var tab = document.getElementById('infotext');
  tab.innerHTML='';
};
AFRAME.registerComponent('rotation-reader', {
  /**
   * We use IIFE (immediately-invoked function expression) to only allocate one
   * vector or euler and not re-create on every tick to save memory.
   */
  tick: (function () {
    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();

    return function () {
      this.el.object3D.getWorldPosition(position);
      this.el.object3D.getWorldQuaternion(quaternion);
      // position and rotation now contain vector and quaternion in world space.
    };
  })()
});