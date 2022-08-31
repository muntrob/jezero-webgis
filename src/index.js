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
////var zoom = 8;
var zoom = 1;
var mapCenter = transform([77.4565,18.4475], projection49901, projection49911);
//var mapCenter = transform([77.6790,18.4022], projection49901, projection49911);
var rotation = 0;

var mainview = new View({
    center: mapCenter,
    zoom: zoom,
    //minZoom: 9,
    //minZoom: 2,
    //minZoom: 0,
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

var pr_featuresAsText=
  '{"type": "FeatureCollection","name": "pr_targets","features": [\
    { "type": "Feature", "properties": { "Id": 0, "Name": "Canyonlands", "Orbit": 18, "PR_Date": "2004-01-19", "Release_Nr": "002-004", "Year": 2004, "lat_1": 5.3066422791900001, "lon_1": -36.944304699500002, "lon_1_pos": 323.05569530100001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc002-Canyonlands.php", "FN_3D": "003-20040125-0018-3d-Canyonlands.tif", "FN_CO": "004-20040125-0018-co-Canyonlands.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2189862.486272821202874, 314549.615963605057914 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Dark Spot", "Orbit": 18, "PR_Date": "2004-01-23", "Release_Nr": "005-006", "Year": 2004, "lat_1": 6.17612137279, "lon_1": -36.813882835500003, "lon_1_pos": 323.186117164, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc005-DarkSpot.php", "FN_3D": "005-20040122-0018-3d-DarkSpot.tif", "FN_CO": "006-20040122-0018-co-DarkSpot.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2182131.769731445703655, 366087.726239443873055 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Depression", "Orbit": 18, "PR_Date": "2004-01-23", "Release_Nr": "007-008", "Year": 2004, "lat_1": -14.8912363041, "lon_1": -37.148563280200001, "lon_1_pos": 322.85143671999998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc007-Depression.php", "FN_3D": "007-20040122-0018-3d-Depression.tif", "FN_CO": "008-20040122-0018-co-Depression.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2201969.851861428935081, -882673.527673261589371 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mesa Details", "Orbit": 18, "PR_Date": "2004-01-23", "Release_Nr": "009-010", "Year": 2004, "lat_1": 9.0235791464799995, "lon_1": -36.883579175500003, "lon_1_pos": 323.11642082399999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc009-MesaDetails.php", "FN_3D": "009-20040122-0018-3d-Mesa.tif", "FN_CO": "010-20040122-0018-co-Mesa.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2186262.99920593528077, 534869.924485050723888 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Albor Tholus", "Orbit": 32, "PR_Date": "2004-01-23", "Release_Nr": "010-011", "Year": 2004, "lat_1": 19.055435710800001, "lon_1": 150.352257041, "lon_1_pos": 150.352257041, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc011-AlborTholus.php", "FN_3D": "010-20040330-0032-3d-1-AlborTholus.tif", "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8912084.55803201161325, 1129505.187934284796938 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Reull Vallis", "Orbit": 22, "PR_Date": "2004-01-23", "Release_Nr": "012-013", "Year": 2004, "lat_1": -41.026867414900003, "lon_1": 100.770703575, "lon_1_pos": 100.770703575, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc012-ReullVallis.php", "FN_3D": "012-20040122-0022-3d-ReullVallis.tif", "FN_CO": "013-20040122-0022-co-ReullVallis.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5973152.97360860183835, -2431855.156347616575658 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Gusev Crater", "Orbit": 24, "PR_Date": "2004-01-23", "Release_Nr": "014", "Year": 2004, "lat_1": -14.4639494352, "lon_1": 175.569358956, "lon_1_pos": 175.569358956, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc014-GusevCrater.php", "FN_3D": "014-20040116-0024-3d-GusevCrater.tif", "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 10406820.646470136940479, -857346.227766277617775 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Olympus Mons", "Orbit": 37, "PR_Date": "2004-02-11", "Release_Nr": "019-021", "Year": 2004, "lat_1": 18.2867765174, "lon_1": -133.18543057599999, "lon_1_pos": 226.81456942400001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc019-OlympusMons.php", "FN_3D": "020-20040209-0037-3d-1-OlympusMons.tif", "FN_CO": "019-20040209-0037-co-OlympusMons.tif", "FN_3D2": null, "FN_AN": "005-20040209-0037-an-OlympusMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "019-20040209-0037-nd-OlympusMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7894526.111876191571355, 1083943.146745805395767 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Kasei Valles", "Orbit": 61, "PR_Date": "2004-02-18", "Release_Nr": "022", "Year": 2004, "lat_1": 29.715525423399999, "lon_1": -50.525292116400003, "lon_1_pos": 309.474707884, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc022-KaseiVallis.php", "FN_3D": null, "FN_CO": "022-20040217-0061-co-KaseiVallis.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2994871.407476575113833, 1761378.781220919685438 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hecates Tholus", "Orbit": 32, "PR_Date": "2004-03-01", "Release_Nr": "023-024", "Year": 2004, "lat_1": 31.7014320838, "lon_1": 150.151779815, "lon_1_pos": 150.151779815, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc023-HecatesTholus.php", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": "024-20040224-0032-an-HecatesTholus.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "023-200402240032-nd-HecatesTholus.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8900201.331138992682099, 1879092.797824548790231 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ascraeus Mons", "Orbit": 68, "PR_Date": "2004-03-22", "Release_Nr": "025-027", "Year": 2004, "lat_1": 7.0995065118399996, "lon_1": -104.756470311, "lon_1_pos": 255.24352968900001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc025-AscraeusMons.php", "FN_3D": null, "FN_CO": "026-20040315-0068-co-AscraeusMons.tif", "FN_3D2": null, "FN_AN": "025-20040315-0068-an-AscraeusMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "026-20040315-0068-nd-AscraeusMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6209408.091274222359061, 420821.101054112368729 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Claritas Fossae", "Orbit": 68, "PR_Date": "2004-03-31", "Release_Nr": "028-030", "Year": 2004, "lat_1": -30.945081353399999, "lon_1": -104.531052481, "lon_1_pos": 255.46894751900001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc028-ClaritasFossae.php", "FN_3D": null, "FN_CO": "029-20040329-0068-co-ClaritasFossae.tif", "FN_3D2": null, "FN_AN": "030-20040329-0068-an-ClaritasFossae.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "028-20040329-0068-nd-ClaritasFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6196046.517589656636119, -1834260.337059239158407 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Louros Valles", "Orbit": 97, "PR_Date": "2004-04-08", "Release_Nr": "031-033", "Year": 2004, "lat_1": -7.7848331158299997, "lon_1": -84.999211072700007, "lon_1_pos": 275.00078892699997, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc031-LourosValles.php", "FN_3D": null, "FN_CO": "032-20040406-0097-co-LourosValles.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "031-20040406-0097-nd-1-LourosValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5038302.526054820045829, -461443.628210136899725 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Olympus Mons West", "Orbit": 143, "PR_Date": "2004-04-21", "Release_Nr": "035-038", "Year": 2004, "lat_1": 18.9014137, "lon_1": -139.366733724, "lon_1_pos": 220.633266276, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc034-OlympusMonsWest.php", "FN_3D": "037-20040416-0143-3d-1-OlympusMons.tif", "FN_CO": "034-20040416-0143-co-OlympusMons.tif", "FN_3D2": null, "FN_AN": "036-20040416-0143-an-OlympusMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "035-20040416-0143-nd-OlympusMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8260920.986327847465873, 1120375.5798282797914 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Acheron Fossae", "Orbit": 37, "PR_Date": "2004-05-07", "Release_Nr": "039-045", "Year": 2004, "lat_1": 37.021524002900001, "lon_1": -130.59691677500001, "lon_1_pos": 229.40308322499999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc039-AcheronFossae.php", "FN_3D": "042-20040506-0037-3d-1-AcheronFossae.tif", "FN_CO": "040-20040506-0037-co-1-AcheronFossae.tif", "FN_3D2": null, "FN_AN": "045-20040506-0037-an-AcheronFossaeCrater.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "039-20040506-0037-nd-1-AcheronFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7741092.739287320524454, 2194439.637121363542974 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Arsia Mons", "Orbit": 263, "PR_Date": "2004-05-24", "Release_Nr": "046-048", "Year": 2004, "lat_1": -11.141579183, "lon_1": -120.657927884, "lon_1_pos": 239.342072116, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc046-ArsiaMons.php", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": "048-20040519-0263-an-ArsiaMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "047-20040519-0263-ctxt-ArsiaMons.tif", "Comment": null, "FN_Video": null, "FN_ND": "046-20040519-0263-nd-ArsiaMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7151962.179086987860501, -660413.736005727318116 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mangala Valles", "Orbit": 299, "PR_Date": "2004-06-09", "Release_Nr": "049-052", "Year": 2004, "lat_1": -10.5405285348, "lon_1": -150.45162608000001, "lon_1_pos": 209.54837392, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc049-MangalaValles.php", "FN_3D": "051-20040602-0299-3d-1-MangalaValles.tif", "FN_CO": "050-20040602-0299-co-MangalaValles.tif", "FN_3D2": null, "FN_AN": "052-20040602-0299-an-MangalaValles.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "049-20040602-0299-ctxt-MangalaValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "049-20040602-0299-nd-MangalaValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8917974.627777818590403, -624786.640635872841813 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Juventae Chasma", "Orbit": 243, "PR_Date": "2006-01-19", "Release_Nr": "053-059", "Year": 2006, "lat_1": -4.6987331262599996, "lon_1": -63.082502403699998, "lon_1_pos": 296.91749759599998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc053-JuventaeChasma.php", "FN_3D": "056-20040615-0243-3d-1-JuventaeChasma.tif", "FN_CO": "054-20040615-0243-co-JuventaeChasma.tif", "FN_3D2": null, "FN_AN": "055-20040615-0243-an-JuventaeChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "053-20040615_0243-ctxt-JuventaeChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "053-20040615-0243-nd-JuventaeChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3739196.248993633780628, -278515.984801633749157 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Melas Chasma", "Orbit": 360, "PR_Date": "2004-06-22", "Release_Nr": "059-062", "Year": 2004, "lat_1": -11.0347304292, "lon_1": -74.782826378500005, "lon_1_pos": 285.21717362200002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc059-MelasChasma.php", "FN_3D": "062-20040616-0360-3d-MelasChasma.tif", "FN_CO": "061-20040616-0360-co-MelasChasma.tif", "FN_3D2": null, "FN_AN": "060-20040616-0360-an-MelasChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "059-20040616-0360-ctxt-MelasChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "059-20040616-0360-nd-MelasChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4432729.413523068651557, -654080.308441035216674 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hellas", "Orbit": 488, "PR_Date": "2004-07-08", "Release_Nr": "063-066", "Year": 2004, "lat_1": -28.911092012400001, "lon_1": 68.1469023298, "lon_1_pos": 68.1469023298, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc063-Hellas.php", "FN_3D": "066-20040706-0488-3d-HellasRim.tif", "FN_CO": "064-20040706-0488-co-HellasRim.tif", "FN_3D2": null, "FN_AN": "065-20040706-0488-an-HellasRim.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "063-20040706-0488-nd-HellasRim.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4039387.022750486154109, -1713696.234102165093645 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Dao Vallis", "Orbit": 528, "PR_Date": "2004-08-16", "Release_Nr": "064-071", "Year": 2004, "lat_1": -32.937440726799998, "lon_1": 93.531186806099996, "lon_1_pos": 93.531186806099996, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc067-DaoVallis.php", "FN_3D": "070-20040810-0528-3d-1-DaoVallis.tif", "FN_CO": "068-20040810-0528-co-DaoVallis.tif", "FN_3D2": null, "FN_AN": "069-20040810-0528-an-DaoVallis.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "067-20040810-0528-nd-DaoVallis.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5544032.806929704733193, -1952356.836275526788086 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Crater Dune", "Orbit": 427, "PR_Date": "2004-08-23", "Release_Nr": "072-076", "Year": 2004, "lat_1": -43.8755682054, "lon_1": -56.709462405399996, "lon_1_pos": 303.29053759499999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc072-CraterDune.php", "FN_3D": "075-20040817-0427-3d-1-CraterDune.tif", "FN_CO": "073-20040817-0427-co-CraterDune.tif", "FN_3D2": null, "FN_AN": "074-20040817-0427-an-CraterDune.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "072-20040817-0427-nd-CraterDune.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3361436.230789535213262, -2600711.034039934165776 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Eos Chasma", "Orbit": 533, "PR_Date": "2004-08-30", "Release_Nr": "077-081", "Year": 2004, "lat_1": -11.542518857899999, "lon_1": -38.794316779299997, "lon_1_pos": 321.20568322100002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc077-EosChasma.php", "FN_3D": "080-20040824-0533-3d-1-EosChasma.tif", "FN_CO": "078-20040824-0533-co-EosChasma.tif", "FN_3D2": null, "FN_AN": "079-20040824-0533-an-EosChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "077-20040824-0533-nd-EosChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2299521.392719107214361, -684179.313958816928789 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Solis Planum", "Orbit": 431, "PR_Date": "2004-09-10", "Release_Nr": "082-087", "Year": 2004, "lat_1": -33.827932624799999, "lon_1": -89.766823016999993, "lon_1_pos": 270.23317698300002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc082-SolisPlanum.php", "FN_3D": "085-20040831-0431-3d-1-SolisPlanum.tif", "FN_CO": "083-20040831-0431-co-SolisPlanum.tif", "FN_3D2": null, "FN_AN": "084-20040831-0431-an-SolisPlanum.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "082-20040831-0431-nd-SolisPlanum.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5320901.281958233565092, -2005140.474176461808383 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Claritas Fossae", "Orbit": 508, "PR_Date": "2004-10-05", "Release_Nr": "095-100", "Year": 2004, "lat_1": -29.127452117000001, "lon_1": -99.480588167299999, "lon_1_pos": 260.51941183299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc095-ClaritasFossae.php", "FN_3D": "098-20040914-0508-3d-1-ClaritasFossae.tif", "FN_CO": "096-20040914-0508-co-ClaritasFossae.tif", "FN_3D2": null, "FN_AN": "097-20040914-0508-an-ClaritasFossae.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "095-20040914-0508-ctxt-ClaritasFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "101-20040914-0508-nd-1-ClaritasFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5896681.773058908060193, -1726520.913862091023475 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ophir Chasma", "Orbit": 334, "PR_Date": "2004-09-27", "Release_Nr": "088-094", "Year": 2004, "lat_1": -4.5557404877199996, "lon_1": -71.972909630800004, "lon_1_pos": 288.02709036900001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc088-OphirChasma.php", "FN_3D": "091-20040907-0334-3d-1-OphirChasma.tif", "FN_CO": "089-20040907-0334-co-OphirChasma.tif", "FN_3D2": null, "FN_AN": "090-20040907-0334-an-OphirChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "088-20040907-0334-ctxt-OphirChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "088-20040907-0334-nd-OphirChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4266172.448240051046014, -270040.139404095243663 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Promethei Terra", "Orbit": 368, "PR_Date": "2004-10-12", "Release_Nr": "103-108", "Year": 2004, "lat_1": -42.366072709500003, "lon_1": 118.690472464, "lon_1_pos": 118.690472464, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc103-PrometheiTerra.php", "FN_3D": "108-20040921-0368-3d-PrometheiTerra.tif", "FN_CO": "106-20040921-0368-co-PrometheiTerra.tif", "FN_3D2": null, "FN_AN": "107-20040921-0368-an-PrometheiTerra.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "103-20040921-0368-nd-1-PrometheiTerra.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 7035341.854217886924744, -2511236.145103161688894 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Huygens Rim", "Orbit": 532, "PR_Date": "2004-10-19", "Release_Nr": "109-113", "Year": 2004, "lat_1": -14.3504479104, "lon_1": 61.3346194047, "lon_1_pos": 61.3346194047, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc109-HuygensRim.php", "FN_3D": "112-20040928-0532-3d-1-HuygensRim.tif", "FN_CO": "110-20040928-0532-co-HuygensRim.tif", "FN_3D2": null, "FN_AN": "111-20040928-0532-an-HuygensRim.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "109-20040928-0532-ctxt-HuygensRim.tif", "Comment": null, "FN_Video": null, "FN_ND": "109-20040928-0532-nd-HuygensRim.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3635591.012918491847813, -850618.459212172776461 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tithonium Chasma", "Orbit": 442, "PR_Date": "2004-11-03", "Release_Nr": "121-125", "Year": 2004, "lat_1": -4.36976745652, "lon_1": -84.578824977099998, "lon_1_pos": 275.42117502299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc121-TithoniumChasma.php", "FN_3D": "124-20041022-0442-3d-1-TitoniumChasma.tif", "FN_CO": "122-20041022-0442-co-TithoniumChasma.tif", "FN_3D2": null, "FN_AN": "123-20041022-0442-an-TithoniumChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "121-20041022-0442-nd-TithoniumChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5013384.267395121045411, -259016.644232263468439 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Coprates Catena", "Orbit": 438, "PR_Date": "2004-11-17", "Release_Nr": "126-130", "Year": 2004, "lat_1": -15.3046015217, "lon_1": -62.112975734099997, "lon_1_pos": 297.88702426600003, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc126-CopratesCatena.php", "FN_3D": "129-20041029-0438-3d-1-CopratesCatena.tif", "FN_CO": "127-20041029-0438-co-CopratesCatena.tif", "FN_3D2": null, "FN_AN": "128-20041029-0438-an-CopratesCatena.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "126-20041029-0438-ctxt-1-CopratesCatena.tif", "Comment": null, "FN_Video": null, "FN_ND": "126-20041029-0438-nd-CopratesCatena.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3681727.848913628142327, -907175.625913869123906 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Reull Vallis", "Orbit": 451, "PR_Date": "2004-12-08", "Release_Nr": "138-142", "Year": 2004, "lat_1": -42.160594336700001, "lon_1": 102.39911967899999, "lon_1_pos": 102.39911967899999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc138-ReullVallis.php", "FN_3D": "141-20041112-0451-3d-1-ReullVallis.tif", "FN_CO": "139-20041112-0451-co-ReullVallis.tif", "FN_3D2": null, "FN_AN": "140-20041112-0451-an-ReullVallis.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "138-20041112-0451-ctxt-ReullVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": "138-20041112-0451-nd-ReullVallis.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6069676.845628194510937, -2499056.476709521841258 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Candor Chasma", "Orbit": 143, "PR_Date": "2004-12-22", "Release_Nr": "143-146", "Year": 2004, "lat_1": -6.4394124885600004, "lon_1": -70.512239926800007, "lon_1_pos": 289.487760073, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc143-CandorChasma.php", "FN_3D": "146-20041216-0360-3d-CandorChasma.tif", "FN_CO": "144-20041216-0360-co-CandorChasma.tif", "FN_3D2": null, "FN_AN": "145-20041216-0360-an-CandorChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "143-20041216-0360-ctxt-CandorChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "143-20041216-0360-nd-CandorChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4179591.693349874112755, -381694.227487031312194 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Thaumasia", "Orbit": 563, "PR_Date": "2005-01-20", "Release_Nr": "147-151", "Year": 2005, "lat_1": -25.3816407401, "lon_1": -107.247734202, "lon_1_pos": 252.752265798, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc147-Thaumasia.php", "FN_3D": "150-20050107-0563-3d-1-Thaumasia.tif", "FN_CO": "148-20050107-0563-co-Thaumasia.tif", "FN_3D2": null, "FN_AN": "149-20050107-0563-an-Thaumasia.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "147-20050107-0563-nd-1-Thaumasia.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6357077.004870466887951, -1504489.077514892909676 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ophir Chasma", "Orbit": 334, "PR_Date": "2005-02-15", "Release_Nr": "152-155", "Year": 2005, "lat_1": -6.515747316, "lon_1": -72.5235916699, "lon_1_pos": 287.47640833000003, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc152-OphirChasma.php", "FN_3D": "155-20050209-mosaic-3d-1-OphirChasma.tif", "FN_CO": "153-20050209-mosaic-co-OphirChasma.tif", "FN_3D2": null, "FN_AN": "154-20050209-mosaic-an-OphirChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "152-20050209-mosaic-nd-OphirChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4298813.959535005502403, -386218.951293922029436 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aureum Chaos", "Orbit": 456, "PR_Date": "2005-04-22", "Release_Nr": "156-162", "Year": 2005, "lat_1": -2.8929029044300001, "lon_1": -25.438801983099999, "lon_1_pos": 334.56119801699998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc156-AureumChaos.php", "FN_3D": "162-20050204-0456-3d-1-AureumChaos.tif", "FN_CO": "157-20050204-0456-co-AureumChaos.tif", "FN_3D2": null, "FN_AN": "158-20050204-0456-an-AureumChaos.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "156-20050204-0456-nd-AureumChaos.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1507877.292900651227683, -171475.944624426716473 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Holden Crater", "Orbit": 511, "PR_Date": "2005-05-09", "Release_Nr": "163-167", "Year": 2005, "lat_1": -26.075082737, "lon_1": -34.265784138299999, "lon_1_pos": 325.73421586199999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc163-HoldenCrater.php", "FN_3D": "167-20041116-0511-3d-1-Holden.tif", "FN_CO": "164-20041116-0511-co-Holden.tif", "FN_3D2": null, "FN_AN": "165-20041116-0511-an-Holden.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "163-20041116-0511-ctxt-Holden.tif", "Comment": null, "FN_Video": null, "FN_ND": "163-20041116-0511-nd-1-Holden.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2031093.990198070649058, -1545592.642132762353867 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tithonium Chasma 2", "Orbit": 168, "PR_Date": "2005-04-29", "Release_Nr": "168-172", "Year": 2005, "lat_1": -4.48396342737, "lon_1": -84.949924925700003, "lon_1_pos": 275.05007507400001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc168-TithoniumChasma.php", "FN_3D": "171-20050115-0887-3d-1-TithoniumChasma.tif", "FN_CO": "169-20050115-0887-co-TithoniumChasma.tif", "FN_3D2": null, "FN_AN": "170-20050115-0887-an-TithoniumChasma.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "168-20050115-0887-nd-1-TithoniumChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5035381.104596309363842, -265785.575862939585932 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Medusae Fossae Formation", "Orbit": 917, "PR_Date": "2005-03-24", "Release_Nr": "173-177", "Year": 2005, "lat_1": -0.82913334952999995, "lon_1": -147.43073246399999, "lon_1_pos": 212.56926753600001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc173-MedusaeFossae.php", "FN_3D": "176-20040129-0917-3d-1-MedusaeFossae.tif", "FN_CO": "174-20040129-0917-co-MedusaeFossae.tif", "FN_3D2": null, "FN_AN": "175-20040129-0917-an-MedusaeFossae.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": "173-20040129-0917-6-nd-1-MedusaeFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8738912.072436220943928, -49146.628499952377751 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hale Crater", "Orbit": 533, "PR_Date": "2004-11-24", "Release_Nr": "131-137", "Year": 2004, "lat_1": -37.057941630099997, "lon_1": -36.255566847300003, "lon_1_pos": 323.74443315299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc131-HaleCrater.php", "FN_3D": "136-20041102-0533-3d-1-HaleCrater.tif", "FN_CO": "134-20041102-0533-co-HaleCrater.tif", "FN_3D2": null, "FN_AN": "135-20041102-0533-an-HaleCrater.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "131-20041102-0533-ctxt-HaleCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "131-20041102-0533-nd-1-HaleCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2149037.75841241562739, -2196598.280961318407208 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hour Glass", "Orbit": 451, "PR_Date": "2005-03-18", "Release_Nr": "178-181", "Year": 2005, "lat_1": -34.337240636499999, "lon_1": 102.600133537, "lon_1_pos": 102.600133537, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc178-HourGlass.php", "FN_3D": "181-20050317-0451-3d-1-HourGlass.tif", "FN_CO": "179-20050317-0451-co-HourGlass.tif", "FN_3D2": null, "FN_AN": "180-20050317-0451-an-HourGlass.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "178-20050317-0451-ctxt-HourGlass.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6081591.881276164203882, -2035329.552512029418722 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Iani Chaos", "Orbit": 923, "PR_Date": "2005-06-01", "Release_Nr": "182-190", "Year": 2005, "lat_1": 1.50804814994, "lon_1": -17.797546717300001, "lon_1_pos": 342.20245328300001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc182-IaniChaos.php", "FN_3D": "185-20050530-923-3d-1-IaniChaos.tif", "FN_CO": "183-20050530-923-co-IaniChaos.tif", "FN_3D2": null, "FN_AN": "187-20050530-923-an-IaniChaos.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "182-20050530-923-ctxt-IaniChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": "182-20050530-923-nd-IaniChaos.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1054944.198322391603142, 89389.097938203980448 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Coprates Chasma", "Orbit": 449, "PR_Date": "2005-06-10", "Release_Nr": "191-196", "Year": 2005, "lat_1": -13.1842970296, "lon_1": -61.281714592100002, "lon_1_pos": 298.71828540799999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc191-CopratesChasma.php", "FN_3D": "195-20050517-0449-3d-1-Coprates.tif", "FN_CO": "192-20050517-0449-co-Coprates.tif", "FN_3D2": null, "FN_AN": "193-20050517-0449-an-Coprates.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "191-20050517-0449-ctxt-Coprates.tif", "Comment": null, "FN_Video": null, "FN_ND": "191-20050517-0449-nd-Coprates.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3632455.096155675593764, -781495.218484122189693 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nicholson Crater", "Orbit": 1104, "PR_Date": "2005-07-15", "Release_Nr": "197-202", "Year": 2005, "lat_1": 0.16207303244, "lon_1": -164.44560852800001, "lon_1_pos": 195.55439147199999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc197-NicholsonCrater.php", "FN_3D": "201-20050626-1104-3d-1-NicholsonCrater.tif", "FN_CO": "198-20050626-1104-co-NicholsonCrater.tif", "FN_3D2": null, "FN_AN": "199-20050626-1104-an-NicholsonCrater.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "197-20050626-1104-ctxt-NicholsonCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "197-20050626-1104-nd-NicholsonCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9747463.704505944624543, 9606.829974312955528 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Olympus Mons East", "Orbit": 1089, "PR_Date": "2006-03-03", "Release_Nr": "203-208", "Year": 2006, "lat_1": 17.1663198643, "lon_1": -128.952030334, "lon_1_pos": 231.047969666, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc203-OlympusMonsEast.php", "FN_3D": "206-20050701-1089-3d-1-OlympusMons.tif", "FN_CO": "204-20050701-1089-co-OlympusMons.tif", "FN_3D2": null, "FN_AN": "205-20050701-1089-an-OlympusMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "203-20050701-1089-ctxt-OlympusMons.tif", "Comment": null, "FN_Video": null, "FN_ND": "203-20050701-1089-nd-OlympusMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7643592.593052396550775, 1017528.417544494033791 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Crater Ice", "Orbit": 1343, "PR_Date": "2005-07-28", "Release_Nr": "209-212", "Year": 2005, "lat_1": 70.260476126399993, "lon_1": 103.41469653599999, "lon_1_pos": 103.41469653599999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc209-CraterIce.php", "FN_3D": "212-20050701-1343-3d-1-CraterIce.tif", "FN_CO": "210-20050701-1343-co-CraterIce.tif", "FN_3D2": null, "FN_AN": "211-20050701-1343-an-CraterIce.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "209-20050701-1343-ctxt-CraterIce.tif", "Comment": null, "FN_Video": null, "FN_ND": "209-20050701-1343-nd-CraterIce.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6129874.856663757003844, 4164668.470232938881963 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Butterfly Crater", "Orbit": 368, "PR_Date": "2006-01-10", "Release_Nr": "217-222", "Year": 2006, "lat_1": -35.290043915200002, "lon_1": 118.705978285, "lon_1_pos": 118.705978285, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc217-ButterflyCrater.php", "FN_3D": "219-20051214-0368-3d-1-ButterflyCrater.tif", "FN_CO": "218-20051214-0368-co-ButterflyCrater.tif", "FN_3D2": null, "FN_AN": "222-20051214-0368-an-ButterflyCrater.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "217-20051212-0368-ctxt-ButterflyCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "217-20051214-0368-nd-ButterflyCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 7036260.957039969973266, -2091806.678658989490941 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Biblis Patera", "Orbit": 1034, "PR_Date": "2005-09-08", "Release_Nr": "213-216", "Year": 2005, "lat_1": 2.3203544706199999, "lon_1": -123.724066845, "lon_1_pos": 236.27593315499999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc213-BiblisPatera.php", "FN_3D": "216-20059719-1034-3d-1-BiblisPatera.tif", "FN_CO": "216-20059719-1034-co-BiblisPatera.tif", "FN_3D2": null, "FN_AN": "216-20059719-1034-an-BiblisPatera.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "213-20059719-1034-ctxt-BiblisPatera.tif", "Comment": null, "FN_Video": null, "FN_ND": "213-20059719-1034-nd-BiblisPatera.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7333706.638564212247729, 137538.309393102943432 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ausonia Mensa", "Orbit": 506, "PR_Date": "2006-02-28", "Release_Nr": "223-226", "Year": 2006, "lat_1": -26.9227180235, "lon_1": 99.350472037499998, "lon_1_pos": 99.350472037499998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc223-AusoniaMensa.php", "FN_3D": "225-20050517-0506-3d-1-AusoniaMensa.tif", "FN_CO": "224-20050517-0506-co-AusoniaMensa.tif", "FN_3D2": null, "FN_AN": "226-20050517-0506-an-AusoniaMensa.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "223-20050517-0506-ctxt-AusoniaMensa.tif", "Comment": null, "FN_Video": null, "FN_ND": "223-20050517-0506-nd-AusoniaMensa.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5888969.178822865709662, -1595835.967346186749637 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Libya Montes Animation", "Orbit": 922, "PR_Date": "2006-03-27", "Release_Nr": "236-241", "Year": 2006, "lat_1": 2.30012242448, "lon_1": 88.681884958799998, "lon_1_pos": 88.681884958799998, "Movie": "x", "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc236-LibyaMontes.php", "FN_3D": "238-20060207-0922-3d-1-LibyaMontes.tif", "FN_CO": "237-20060207-0922-co-LibyaMontes.tif", "FN_3D2": null, "FN_AN": "240-20060207-0922-an-LibyaMontes.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "236-20060207-0922-ctxt-LibyaMontes.tif", "Comment": null, "FN_Video": "241-20060207-0922-mov-LibyaMontes.mov", "FN_ND": "236-20060207-0922-nd-LibyaMontes.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5256591.906729875132442, 136339.060977495653788 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Phlegethon Catena", "Orbit": 1217, "PR_Date": "2006-02-09", "Release_Nr": "227-231", "Year": 2006, "lat_1": 38.775675100800001, "lon_1": -103.283423347, "lon_1_pos": 256.716576653, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc227-PhlegethonCatena.php", "FN_3D": "229-20060501-1217-3d-1-PhlegethonCatena.tif", "FN_CO": "228-20060501-1217-co-PhlegethonCatena.tif", "FN_3D2": null, "FN_AN": "232-20060501-1217-an-PhlegethonCatena.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "227-20060501-1217-ctxt-PhlegethonCatena.tif", "Comment": null, "FN_Video": null, "FN_ND": "227-20060501-1217-nd-PhlegethonCatena.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6122093.678051209077239, 2298416.412859181407839 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Galle Crater", "Orbit": 0, "PR_Date": "2006-04-10", "Release_Nr": "246-252", "Year": 2006, "lat_1": -50.645532451900003, "lon_1": -30.8515299908, "lon_1_pos": 329.14847000899999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc246-GalleCrater.php", "FN_3D": "249-20060827-mosaic-3d-1-GalleCrater.tif", "FN_CO": "247-20060827-mosaic-co-GalleCrater.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "246-20060827-mosaic-ctxt-GalleCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "246-20060827-mosaic-nd-GalleCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1828715.108338595135137, -3001998.616995558608323 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aram Chaos", "Orbit": 945, "PR_Date": "2006-05-30", "Release_Nr": "257-259", "Year": 2006, "lat_1": 1.9335373741299999, "lon_1": -19.682374656699999, "lon_1_pos": 340.31762534299997, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc257-AramChaos.php", "FN_3D": "259-20050517-0945-3d-1-AramChaos.tif", "FN_CO": "258-20050517-0945-co-AramChaos.tif", "FN_3D2": null, "FN_AN": "260-20050517-0945-an-AramChaos.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "257-20050517-0945-ctxt-AramChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": "257-20050517-0945-nd-AramChaos.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1166666.804317306727171, 114609.843001544635626 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Iani Chaos", "Orbit": 945, "PR_Date": "2006-05-17", "Release_Nr": "261-264", "Year": 2006, "lat_1": -0.78078313851000003, "lon_1": -19.464259615500001, "lon_1_pos": 340.535740385, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc261-IaniChaos.php", "FN_3D": "263-20050517-0945-3d-1-IaniChaos.tif", "FN_CO": "262-20050517-0945-co-IaniChaos.tif", "FN_3D2": null, "FN_AN": "264-20050517-0945-an-IaniChaos.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "261-20050517-0945-ctxt-IaniChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": "261-20050517-0945-nd-IaniChaos.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1153738.101225254358724, -46280.684366229892476 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tempe Terra", "Orbit": 1180, "PR_Date": "2006-05-08", "Release_Nr": "265-267", "Year": 2006, "lat_1": 48.630599186700003, "lon_1": -72.042105196799994, "lon_1_pos": 287.95789480299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc265-TempeTerra.php", "FN_3D": null, "FN_CO": "266-20051123-1180-co-TempeTerra.tif", "FN_3D2": null, "FN_AN": "267-20051123-1180-an-TempeTerra.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "265-20051123-1180-ctxt-TempeTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": "265-20051123-1180-nd-TempeTerra.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4270273.994483442977071, 2882564.057166549842805 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nanedi Valles", "Orbit": 905, "PR_Date": "2006-04-24", "Release_Nr": "253-255", "Year": 2006, "lat_1": 6.9478578867699996, "lon_1": -47.8124847757, "lon_1_pos": 312.18751522399998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc253-NanediValles.php", "FN_3D": null, "FN_CO": "254-20050714-0905-co-NanediValles.tif", "FN_3D2": null, "FN_AN": "255-20050714-0905-an-NanediValles.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "253-20050714-0905-ctxt-NanediValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "253-20050714-0905-nd-NanediValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2834070.572918604128063, 411832.174672923225444 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Granicus Valles", "Orbit": 1383, "PR_Date": "2006-07-28", "Release_Nr": "272-274", "Year": 2006, "lat_1": 26.3999458272, "lon_1": 136.116937931, "lon_1_pos": 136.116937931, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc272-GranicusVallesTinjarValles.php", "FN_3D": null, "FN_CO": "274-20060712-1383-co-GranicusValles.tif", "FN_3D2": null, "FN_AN": "272-20060712-1383-an-GranicusValles.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "272-20060712-1383-ctxt-GranicusValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "273-20060712-1383-nd-GranicusValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8068290.323653104715049, 1564848.803537130821496 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Apollinaris Patera", "Orbit": 987, "PR_Date": "2006-06-09", "Release_Nr": "268-271", "Year": 2006, "lat_1": -8.6458921860799993, "lon_1": 174.20524286700001, "lon_1_pos": 174.20524286700001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc268-ApollinarisPatera.php", "FN_3D": null, "FN_CO": "269-20060328-0987-co-ApollinarisPatera.tif", "FN_3D2": null, "FN_AN": "271-20060328-0987-an-AppolinarisPatera.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "268-20060328-0987-ctxt-ApollinarisPatera.tif", "Comment": null, "FN_Video": null, "FN_ND": "268-20060328-0987-nd-ApollinarisPatera.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 10325963.077904043719172, -512482.644149091443978 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Pavonis Mons", "Orbit": 902, "PR_Date": "2006-05-23", "Release_Nr": "278-281", "Year": 2006, "lat_1": -1.19938787761, "lon_1": -113.811995078, "lon_1_pos": 246.188004922, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc278-PavonisMons.php", "FN_3D": "281-20050423-0902-3d-1-PavonisMons.tif", "FN_CO": "279-20050423-0902-co-PavonisMons.tif", "FN_3D2": null, "FN_AN": "280-20050423-0902-an-PavonisMons.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "278-20050423-0902-ctxt-PavonisMons.tif", "Comment": null, "FN_Video": null, "FN_ND": "278-20050423-0902-nd-PavonisMons.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6746171.582761250436306, -71093.353658510270179 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Kasei Valles", "Orbit": 1429, "PR_Date": "2006-08-30", "Release_Nr": "290-299", "Year": 2006, "lat_1": 24.438285302299999, "lon_1": -67.924985687200007, "lon_1_pos": 292.075014313, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc290-KaseiValles.php", "FN_3D": "293-20060823-1429-3d-1-KaseiVallesNorth.tif", "FN_CO": "291-20060823-1429-co-KaseiVallesNorth.tif", "FN_3D2": null, "FN_AN": "292-20060823-1429-an-KaseiVallesNorth.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "290-20060823-1429-ctxt-KaseiValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "290-20060823-1429-nd-KaseiVallesNorth.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4026232.980885355267674, 1448571.969280383782461 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Cydonia  Animation", "Orbit": 3253, "PR_Date": "2006-09-21", "Release_Nr": "314", "Year": 2006, "lat_1": 41.117747767799997, "lon_1": -9.9605868811900002, "lon_1_pos": 350.03941311900002, "Movie": "x", "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc300-Cydonia.php", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "314-20060922-3253-mov-Cydonia.mov", "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -590410.774537101155147, 2437242.061773604247719 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Deuteronilus Mensae", "Orbit": 1483, "PR_Date": "2007-05-21", "Release_Nr": "322-326", "Year": 2007, "lat_1": 39.961662669299997, "lon_1": 21.9702613127, "lon_1_pos": 21.9702613127, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc322-DeuteronilusMensae.php", "FN_3D": "325-20070502-1483-3d-1-DeuteronilusMensae.tif", "FN_CO": "324-20070502-1483-co-DeuteronilusMensae.tif", "FN_3D2": null, "FN_AN": "322-20070502-1483-an-DeuteronilusMensae.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "322-20070502-1483-ctxt-DeuteronilusMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": "323-20070502-1483-nd-DeuteronilusMensae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1302280.593818901805207, 2368715.467248850967735 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aeolis Mensae", "Orbit": 4136, "PR_Date": "2007-06-28", "Release_Nr": "327-334", "Year": 2007, "lat_1": -5.6218305552099999, "lon_1": 144.871967428, "lon_1_pos": 144.871967428, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc327-AeolisMensae.php", "FN_3D": "332-20070608-4136-3d-1-AeolisMensae.tif", "FN_CO": "329-20070608-4136-co-AeolisMensae.tif", "FN_3D2": null, "FN_AN": "330-20070608-4136-an-AeolisMensae.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "327-20070608-4136-ctxt-AeolisMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": "328-20070608-4136-nd-AeolisMensae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8587242.048927759751678, -333232.305687299114652 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tyrrhena Terra", "Orbit": 4294, "PR_Date": "2007-07-31", "Release_Nr": "335-340", "Year": 2007, "lat_1": -18.046815631099999, "lon_1": 98.992193807999996, "lon_1_pos": 98.992193807999996, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc335-TyrrhenaTerraImpactCrater.php", "FN_3D": "338-20070629-4294-3d-1-TyrrhenaTerra.tif", "FN_CO": "336-20070629-4294-co-TyrrhenaTerra.tif", "FN_3D2": null, "FN_AN": "337-20070629-4294-an-TyrrhenaTerra.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "335-20070629-4294-ctxt-TyrrhenaTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": "335-20070629-4294-nd-TyrrhenaTerra.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5867732.3451391691342, -1069719.53779273875989 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tiu Valles", "Orbit": 3103, "PR_Date": "2007-09-12", "Release_Nr": "341-345", "Year": 2007, "lat_1": 27.105760071500001, "lon_1": -29.901256892300001, "lon_1_pos": 330.09874310800001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc341-TiuValles.php", "FN_3D": "344-20070629-3103-3d-1-TiuValles.tif", "FN_CO": "342-20070629-3103-co-TiuValles.tif", "FN_3D2": null, "FN_AN": "343-20070629-3103-an-TiuValles.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "341-20070629-3103-ctxt-TiuValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "341-20070629-3103-nd-TiuValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1772387.957858955254778, 1606685.72937786905095 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Maunder Crater", "Orbit": 0, "PR_Date": "2007-10-16", "Release_Nr": "346-350", "Year": 2007, "lat_1": -49.78459393, "lon_1": 1.9378920765600001, "lon_1_pos": 1.9378920765600001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc346-MaunderCrater.php", "FN_3D": "348-20070918-mosaic-3d-1-MaunderCrater.tif", "FN_CO": "350-20070918-mosaic-co-MaunderCrater.tif", "FN_3D2": null, "FN_AN": "347-20070918-mosaic-an-MaunderCrater.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "346-20070918-mosaic-ctxt-MaunderCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "346-20070918-mosaic-nd-MaunderCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 114867.966670811831136, -2950966.746523621492088 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Noctis Labyrinthus", "Orbit": 3155, "PR_Date": "2007-11-30", "Release_Nr": "351-355", "Year": 2007, "lat_1": -6.7055245511699999, "lon_1": -99.587833919199994, "lon_1_pos": 260.41216608100001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc351-NoctisLabyrinthus.php", "FN_3D": "353-20070129-3155-3d-1-NoctisLabyrinthus.tif", "FN_CO": "352-20070129-3155-co-NoctisLabyrinthus.tif", "FN_3D2": null, "FN_AN": "355-20070129-3155-an-NoctisLabyrinthus.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "351-20070129-3155-ctxt-NoctisLabyrinthus.tif", "Comment": null, "FN_Video": null, "FN_ND": "351-20070129-3155-nd-NoctisLabyrinthus.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5903038.732558943331242, -397467.939505591522902 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Terby Crater", "Orbit": 4199, "PR_Date": "2008-01-25", "Release_Nr": "356-360", "Year": 2008, "lat_1": -26.855156517000001, "lon_1": 74.2092308175, "lon_1_pos": 74.2092308175, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc356-TerbyCrater.php", "FN_3D": "358-20071219-4199-3d-1-TerbyCrater.tif", "FN_CO": "357-20071219-4199-co-TerbyCrater.tif", "FN_3D2": null, "FN_AN": "360-20071219-4199-an-TerbyCrater.tif", "FN_HT": "356-20071219-4199-ht-TerbyCrater.tif", "FN_TXT": null, "FN_CTX": "356-20071219-4199-ctxt-TerbyCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "356-20071219-4199-nd-TerbyCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4398729.710146579891443, -1591831.279486154671758 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Candor Chasma", "Orbit": 3195, "PR_Date": "2008-02-15", "Release_Nr": "362-366", "Year": 2008, "lat_1": -6.0709212413499998, "lon_1": -69.764182136200006, "lon_1_pos": 290.23581786400001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc362-CandorChasma.php", "FN_3D": "364-20080211-3195-3d-1-CandorChasma.tif", "FN_CO": "363-20080211-3195-co-CandorChasma.tif", "FN_3D2": null, "FN_AN": "366-20080211-3195-an-CandorChasma.tif", "FN_HT": "362-20080211-3195-ht-CandorChasma.tif", "FN_TXT": null, "FN_CTX": "362-20080211-3195-ctxt-CandorChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "362-20080211-3195-nd-CandorChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4135250.794084845576435, -359852.020269032102078 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Promethei Planum", "Orbit": 2169, "PR_Date": "2008-03-12", "Release_Nr": "368-372", "Year": 2008, "lat_1": -75.996393118300006, "lon_1": 105.086971006, "lon_1_pos": 105.086971006, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc368-PrometheiPlanum.php", "FN_3D": "370-20080305-2169-3d-1-PrometheiPlanum.tif", "FN_CO": "369-20080305-2169-co-PrometheiPlanum.tif", "FN_3D2": null, "FN_AN": "372-20080305-2169-an-PrometheiPlanum.tif", "FN_HT": "368-20080305-2169-ht-PrometheiPlanum.tif", "FN_TXT": null, "FN_CTX": "368-20080305-2169-ctxt-PrometheiPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": "368-20080305-2169-nd-PrometheiPlanum.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6228998.420018648728728, -4504663.21494888048619 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hebes Chasma", "Orbit": 2149, "PR_Date": "2008-03-28", "Release_Nr": "375-381", "Year": 2008, "lat_1": -0.79310080581999998, "lon_1": -77.854259147099995, "lon_1_pos": 282.14574085300001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc375-HebesChasma.php", "FN_3D": "378-20080221-2149-3d-1-HebesChasma.tif", "FN_CO": "376-20080221-2149-co-HebesChasma.tif", "FN_3D2": null, "FN_AN": "381-20080221-2149-an-HebesChasma.tif", "FN_HT": "375-20080221-2149-ht-HebesChasma.tif", "FN_TXT": null, "FN_CTX": "375-20080221-2149-ctxt-HebesChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "375-20080221-2149-nd-HebesChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4614787.661847285926342, -47010.810370352643076 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nepenthes Mensae", "Orbit": 5212, "PR_Date": "2008-04-25", "Release_Nr": "384-390", "Year": 2008, "lat_1": 3.0267524624700002, "lon_1": 121.123067628, "lon_1_pos": 121.123067628, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc384-NepenthesMensae.php", "FN_3D": "388-20080409-5212-3d-1-NepenthesMensae.tif", "FN_CO": "385-20080409-5212-co-1-NepenthesMensae.tif", "FN_3D2": null, "FN_AN": "390-20080409-5212-an-NepenthesMensae.tif", "FN_HT": "384-20080409-5212-ht-NepenthesMensae.tif", "FN_TXT": null, "FN_CTX": "384-20080409-5212-ctxt-NepenthesMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": "384-20080409-5212-nd-NepenthesMensae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 7179533.19672442600131, 179409.836690777709009 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mamers Valles", "Orbit": 3304, "PR_Date": "2008-05-16", "Release_Nr": "391-395", "Year": 2008, "lat_1": 38.968710339499999, "lon_1": 17.132569169700002, "lon_1_pos": 17.132569169700002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc391-MamersValles.php", "FN_3D": "393-20080425-3304-3d-1-MamersValles.tif", "FN_CO": "392-20080425-3304-co-MamersValles.tif", "FN_3D2": null, "FN_AN": "395-20080425-3304-an-MamersValles.tif", "FN_HT": "391-20080425-3304-ht-MamersValles.tif", "FN_TXT": null, "FN_CTX": "391-20080425-3304-ctxt-MamersValles.tif", "Comment": null, "FN_Video": null, "FN_ND": "391-20080425-3304-nd-MamersValles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1015527.855333571904339, 2309858.518246911466122 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Echus Chasma", "Orbit": 0, "PR_Date": "2008-07-14", "Release_Nr": "397-400", "Year": 2008, "lat_1": 1.08733989062, "lon_1": -81.798746432599998, "lon_1_pos": 278.20125356699998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc397-EchusChasma.php", "FN_3D": "399-20080526-mosaic-3d-1-EchusChasma.tif", "FN_CO": "398-20080526-mosaic-co-EchusChasma.tif", "FN_3D2": null, "FN_AN": "400-20080526-mosaic-an-EchusChasma.tif", "FN_HT": "397-20080526-mosaic-ht-EchusChasma.tif", "FN_TXT": null, "FN_CTX": "397-20080526-mosaic-ctxt-EchusChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "397-20080526-mosaic-nd-EchusChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4848595.952576535753906, 64451.74312164861476 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mangala Fossae", "Orbit": 4117, "PR_Date": "2008-09-26", "Release_Nr": "405-408", "Year": 2008, "lat_1": -16.972477110700002, "lon_1": -147.02969209, "lon_1_pos": 212.97030791, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc405-MangalaFossae.php", "FN_3D": "407-20080109-4117-3d-1-MangalaFossae.tif", "FN_CO": "406-20080109-4117-co-MangalaFossae.tif", "FN_3D2": null, "FN_AN": "408-20080109-4117-an-MangalaFossae.tif", "FN_HT": "405-20080109-4117-ht-MangalaFossae.tif", "FN_TXT": null, "FN_CTX": "405-20080109-4117-ctxt-MangalaFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "405-20080109-4117-nd-MangalaFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8715140.525551905855536, -1006038.446955399820581 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Eumenides Dorsum", "Orbit": 5114, "PR_Date": "2008-11-28", "Release_Nr": "423-426", "Year": 2008, "lat_1": -1.97469826268, "lon_1": -153.95812572700001, "lon_1_pos": 206.04187427299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc423-EumenidesDorsum.php", "FN_3D": "425-20081105-5114-3d-1-EumenidesDorsum.tif", "FN_CO": "424-20081105-5114-co-EumenidesDorsum.tif", "FN_3D2": null, "FN_AN": "426-20081105-5114-an-EumenidesDorsum.tif", "FN_HT": "423-20081105-5114-ht-EumenidesDorsum.tif", "FN_TXT": null, "FN_CTX": "423-20081105-5114-ctxt-EumenidesDorsum.tif", "Comment": null, "FN_Video": null, "FN_ND": "423-20081105-5114-nd-EumenidesDorsum.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9125821.333707101643085, -117049.642219877787284 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aridnes Colles", "Orbit": 4209, "PR_Date": "2009-04-24", "Release_Nr": "431-434", "Year": 2009, "lat_1": -35.004896172599999, "lon_1": 172.12926214500001, "lon_1_pos": 172.12926214500001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc431-AriadnesColles.php", "FN_3D": "433-20090331-4209-3d-1-AriadnesColles.tif", "FN_CO": "432-20090331-4209-co-AriadnesColles.tif", "FN_3D2": null, "FN_AN": "434-20090331-4209-an-AriadnesColles.tif", "FN_HT": "431-20090331-4209-ht-AriadnesColles.tif", "FN_TXT": null, "FN_CTX": "431-20090331-4209-ctxt-AriadnesColles.tif", "Comment": null, "FN_Video": null, "FN_ND": "431-20090331-4209-nd-AriadnesColles.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 10202909.948531413450837, -2074904.632465215632692 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Rupes Tenuis", "Orbit": 5209, "PR_Date": "2009-03-06", "Release_Nr": "427-430", "Year": 2009, "lat_1": 80.6782062021, "lon_1": -62.1730891419, "lon_1_pos": 297.82691085800002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc427-RupesTenuis.php", "FN_3D": "429-20081205-5872-3d-1-RupesTenuis.tif", "FN_CO": "428-20081205-5872-co-RupesTenuis.tif", "FN_3D2": null, "FN_AN": "430-20081205-5872-an-RupesTenuis.tif", "FN_HT": "427-20081205-5872-ht-RupesTenuis.tif", "FN_TXT": null, "FN_CTX": "427-20090303-5872-ctxt-RupesTenuis.tif", "Comment": null, "FN_Video": null, "FN_ND": "427-20081205-5872-nd-RupesTenuis.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3685291.052974757738411, 4782176.269353684037924 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hephaestus Fossae", "Orbit": 5122, "PR_Date": "2009-06-05", "Release_Nr": "435-438", "Year": 2009, "lat_1": 21.308584969399998, "lon_1": 126.630129876, "lon_1_pos": 126.630129876, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc435-HephaestusFossae.php", "FN_3D": "437-20090405-5122-3d-1-HephaestusFossae.tif", "FN_CO": "436-20090405-5122-co-HephaestusFossae.tif", "FN_3D2": null, "FN_AN": "438-20090405-5122-an-HephaestusFossae.tif", "FN_HT": "435-20090405-5122-ht-HephaestusFossae.tif", "FN_TXT": null, "FN_CTX": "435-20090405-5122-ctxt-HephaestusFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "435-20090405-5122-nd-HephaestusFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 7505962.645753792487085, 1263059.928710271604359 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ma\'adim Vallis", "Orbit": 6393, "PR_Date": "2009-07-24", "Release_Nr": "439-442", "Year": 2009, "lat_1": -28.900460410099999, "lon_1": -177.88329830699999, "lon_1_pos": 182.11670169300001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc439-MaadimVallis.php", "FN_3D": "441-20090629-6393-3d-1-Ma\'adimVallis.tif", "FN_CO": "440-20090629-6393-co-Ma\'adimVallis.tif", "FN_3D2": null, "FN_AN": "442-20090629-6393-an-Ma\'adimVallis.tif", "FN_HT": "439-20090629-6393-ht-Ma\'adimVallis.tif", "FN_TXT": null, "FN_CTX": "439-20090629-6393-ctxt-Ma\'adimVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": "439-20090629-6393-nd-Ma\'adimVallis.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10543978.701617412269115, -1713066.049094172660261 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Daedalia Planum", "Orbit": 6396, "PR_Date": "2009-10-02", "Release_Nr": "443-446", "Year": 2009, "lat_1": -20.8785905001, "lon_1": -117.207828218, "lon_1_pos": 242.792171782, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc443-DaedaliaPlanum.php", "FN_3D": "445-20090909-6396-3d-1-DaedaliaPlanum.ti", "FN_CO": "444-20090909-6396-co-DaedaliaPlanum.tif", "FN_3D2": null, "FN_AN": "446-20090909-6396-an-DaedaliaPlanum.tif", "FN_HT": "443-20090909-6396-ht-DaedaliaPlanum.tif", "FN_TXT": null, "FN_CTX": "443-20090909-6396-ctxt-DaedaliaPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": "443-20090909-6396-nd-DaedaliaPlanum.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6947458.564989196136594, -1237572.136606691405177 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Sacra Fossae", "Orbit": 6241, "PR_Date": "2009-11-06", "Release_Nr": "447-450", "Year": 2009, "lat_1": 11.9978162097, "lon_1": -74.771918303999996, "lon_1_pos": 285.228081696, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc447-KaseiValles-SacraFossae.php", "FN_3D": "449-20091007-6241-3d-1-KaseiVallesSacraFossae.tif", "FN_CO": "448-20091007-6241-co-KaseiVallesSacraFossae.tif", "FN_3D2": null, "FN_AN": "450-20091007-6241-an-KaseiVallesSacraFossae.tif", "FN_HT": "447-20091007-6241-ht-KaseiVallesSacraFossae.tif", "FN_TXT": null, "FN_CTX": "447-20091007-6241-ctxt-KaseiVallesSacraFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "447-20091007-6241-nd-KaseiVallesSacraFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4432082.840709094889462, 711166.926767421071418 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Sirenum Fossae", "Orbit": 6547, "PR_Date": "2010-01-29", "Release_Nr": "456-459", "Year": 2010, "lat_1": -28.021156401500001, "lon_1": -175.08499155600001, "lon_1_pos": 184.91500844399999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc456-SirenumFossae.php", "FN_3D": "458-20091109-6547-3d-1-SirenumFossae.tif", "FN_CO": "457-20091109-6547-co-SirenumFossae.tif", "FN_3D2": null, "FN_AN": "459-20091109-6547-an-SirenumFossae.tif", "FN_HT": "456-20091109-6547-ht-SirenumFossae.tif", "FN_TXT": null, "FN_CTX": "456-20091109-6547-ctxt-SirenumFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "456-20091109-6547-nd-SirenumFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10378109.91533319093287, -1660945.569952407153323 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Meridiani Planum", "Orbit": 2097, "PR_Date": "2010-05-12", "Release_Nr": "463-466", "Year": 2010, "lat_1": 2.0027005192499998, "lon_1": -7.3171038451500001, "lon_1_pos": 352.68289615499998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc463-MeridianiPlanum.php", "FN_3D": "465-20100804-2097-3d-1-MeridianiPlanum.tif", "FN_CO": "464-20100804-2097-co-MeridianiPlanum.tif", "FN_3D2": null, "FN_AN": "466-20100804-2097-an-MeridianiPlanum.tif", "FN_HT": "463-20100804-2097-ht-MeridianiPlanum.tif", "FN_TXT": null, "FN_CTX": "463-20100804-2097-ctxt-MeridianiPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": "463-20100804-2097-nd-MeridianiPlanum.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -433719.117167600372341, 118709.467508106637979 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Magelhaens Crater", "Orbit": 6547, "PR_Date": "2010-06-28", "Release_Nr": "467-470", "Year": 2010, "lat_1": -33.722801605599997, "lon_1": -175.167248323, "lon_1_pos": 184.832751677, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc467-MagelhaensCrater.php", "FN_3D": "469-20100306-6547-3d-1-MagelhaensCrater.tif", "FN_CO": "468-20100306-6547-co-MagelhaensCrater.tif", "FN_3D2": null, "FN_AN": "470-20100306-6547-an-MagelhaensCrater.tif", "FN_HT": "467-20100306-6547-ht-MagelhaensCrater.tif", "FN_TXT": null, "FN_CTX": "467-20100306-6547-ctxt-MagelhaensCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "467-20100306-6547-nd-MagelhaensCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10382985.660346612334251, -1998908.86481068120338 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Orcus Patera", "Orbit": 0, "PR_Date": "2010-08-27", "Release_Nr": "471-475", "Year": 2010, "lat_1": 14.280648234099999, "lon_1": 176.60620786300001, "lon_1_pos": 176.60620786300001, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc471-OrcusPatera.php", "FN_3D": "474-20103007-mosaic-3d-1-OrcusPatera.tif", "FN_CO": "472-20103007-mosaic-co-OrcusPatera.tif", "FN_3D2": null, "FN_AN": "475-20103007-mosaic-an-OrcusPatera.tif", "FN_HT": "471-20103007-mosaic-ht-OrcusPatera.tif", "FN_TXT": null, "FN_CTX": "471-20103007-mosaic-ctxt-OrcusPatera.tif", "Comment": null, "FN_Video": null, "FN_ND": "471-20103007-mosaic-nd-OrcusPatera.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 10468279.551817929372191, 846481.104512979625724 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Melas Chasma", "Orbit": 3195, "PR_Date": "2010-10-08", "Release_Nr": "476-479", "Year": 2010, "lat_1": -9.7111905408800006, "lon_1": -70.16065113000001, "lon_1_pos": 289.83934886999998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc476-MelasChasma.php", "FN_3D": "478-20101509-3195-3d-1-MelasChasma.tif", "FN_CO": "477-20101509-3195-co-MelasChasma.tif", "FN_3D2": null, "FN_AN": "479-20101509-3195-an-MelasChasma.tif", "FN_HT": "476-20101509-3195-ht-MelasChasma.tif", "FN_TXT": null, "FN_CTX": "476-20101509-3195-ctxt-MelasChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": "476-20101509-3195-nd-MelasChasma.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4158751.373769822530448, -575627.881902057561092 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Phoenicis Lacus", "Orbit": 8417, "PR_Date": "2010-11-05", "Release_Nr": "480-483", "Year": 2010, "lat_1": -12.403245356299999, "lon_1": -111.600382924, "lon_1_pos": 248.399617076, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc480-PhoenicisLacus.php", "FN_3D": "482-20101310-8417-3d-1-PhoenicisLacus.tif", "FN_CO": "481-20101310-8417-co-PhoenicisLacus.tif", "FN_3D2": null, "FN_AN": "483-20101310-8417-an-PhoenicisLacus.tif", "FN_HT": "480-20101310-8417-ht-PhoenicisLacus.tif", "FN_TXT": null, "FN_CTX": "480-20101310-8417-ctxt-PhoenicisLacus.tif", "Comment": null, "FN_Video": null, "FN_ND": "480-20101310-8417-nd-PhoenicisLacus.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6615078.941320625133812, -735198.616803079028614 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Schiaparelli Crater", "Orbit": 8363, "PR_Date": "2010-12-10", "Release_Nr": "488-492", "Year": 2010, "lat_1": 0.14654452316, "lon_1": 13.8231643825, "lon_1_pos": 13.8231643825, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc488-SchiaparelliCrater.php", "FN_3D": "490-20101126-8363-3d-1-SchiaparelliCrater.tif", "FN_CO": "489-20101126-8363-co-SchiaparelliCrater.tif", "FN_3D2": null, "FN_AN": "491-20101126-8363-an-SchiaparelliCrater.tif", "FN_HT": "488-20101126-8363-ht-SchiaparelliCrater.tif", "FN_TXT": null, "FN_CTX": "488-20101126-8363-ctxt-SchiaparelliCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "488-20101126-8363-nd-SchiaparelliCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 819363.887587216566317, 8686.382284220726433 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Eastern Arabia Terra", "Orbit": 7457, "PR_Date": "2011-02-04", "Release_Nr": "493-496", "Year": 2011, "lat_1": 27.193110010600002, "lon_1": 55.8741530438, "lon_1_pos": 55.8741530438, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc493-EasternArabiaTerra.php", "FN_3D": "495-20110113-7457-3d-1-EasternArabiaTerra.tif", "FN_CO": "494-20110113-7457-co-EasternArabiaTerra.tif", "FN_3D2": null, "FN_AN": "496-20110113-7457-an-EasternArabiaTerra.tif", "FN_HT": "493-20110113-7457-ht-EasternArabiaTerra.tif", "FN_TXT": null, "FN_CTX": "493-20110113-7457-ctxt-EasternArabiaTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": "493-20110113-7457-nd-EasternArabiaTerra.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3311923.521042094100267, 1611863.370595547137782 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "South of Huygens", "Orbit": 8433, "PR_Date": "2011-03-04", "Release_Nr": "497-500", "Year": 2011, "lat_1": -20.745293125500002, "lon_1": 55.0919157724, "lon_1_pos": 55.0919157724, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc497-SouthofHuygens.php", "FN_3D": "499-20110208-8433-3d-1-SouthOfHuygens.tif", "FN_CO": "498-20110208-8433-co-SouthOfHuygens.tif", "FN_3D2": null, "FN_AN": "500-20110208-8433-an-SouthOfHuygens.tif", "FN_HT": "497-20110208-8433-ht-SouthOfHuygens.tif", "FN_TXT": null, "FN_CTX": "497-20110208-8433-ctxt-SouthOfHuygens.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3265556.643388063646853, -1229670.975044773891568 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Uranius & Ceraunius Tholi", "Orbit": 0, "PR_Date": "2011-04-01", "Release_Nr": "501-504", "Year": 2011, "lat_1": 25.047563435699999, "lon_1": -97.117074404600004, "lon_1_pos": 262.88292559500002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc501-Uranius&CerauniusTholi.php", "FN_3D": "503-20110322-mosaic-3d-1-UraniusTholi.tif", "FN_CO": "502-20110322-mosaic-co-UraniusTholi.tif", "FN_3D2": null, "FN_AN": "504-20110322-mosaic-an-UraniusTholi.tif", "FN_HT": "501-20110322-mosaic-ht-UraniusTholi.tif", "FN_TXT": null, "FN_CTX": "501-20110322-mosaic-ctxt-UraniusTholi.tif", "Comment": null, "FN_Video": null, "FN_ND": "501-20110322-mosaic-nd-UraniusTholi.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5756585.209679969586432, 1484686.746347225969657 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nili Fossae", "Orbit": 5270, "PR_Date": "2011-05-06", "Release_Nr": "505-508", "Year": 2011, "lat_1": 22.373530824100001, "lon_1": 76.609588427600002, "lon_1_pos": 76.609588427600002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc505-NiliFossae.php", "FN_3D": "507-20110412-5270-3d-1-NiliFossae.tif", "FN_CO": "506-20110412-5270-co-NiliFossae.tif", "FN_3D2": null, "FN_AN": "508-20110412-5270-an-NiliFossae.tif", "FN_HT": "505-20110412-5270-ht-NiliFossae.tif", "FN_TXT": null, "FN_CTX": "505-20110412-5270-ctxt-NiliFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": "505-20110412-5270-nd-NiliFossae.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4541010.18143093585968, 1326184.272125022485852 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ulyxis Rupes", "Orbit": 8995, "PR_Date": "2011-06-03", "Release_Nr": "509-512", "Year": 2011, "lat_1": -71.925950426100002, "lon_1": 161.35038884299999, "lon_1_pos": 161.35038884299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc509-UlyxisRupes.php", "FN_3D": "511-20110518-8995-3d-1-UlyxisRupes.tif", "FN_CO": "510-20110518-8995-co-UlyxisRupes.tif", "FN_3D2": null, "FN_AN": "512-20110518-8995-an-UlyxisRupes.tif", "FN_HT": "509-20110518-8995-ht-UlyxisRupes.tif", "FN_TXT": null, "FN_CTX": "509-20110518-8995-ctxt-UlyxisRupes.tif", "Comment": null, "FN_Video": null, "FN_ND": "509-20110518-8995-nd-UlyxisRupes.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9563995.493927408009768, -4263388.955582642927766 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Crommelin Crater", "Orbit": 7247, "PR_Date": "2011-07-01", "Release_Nr": "513-516", "Year": 2011, "lat_1": 10.2405954823, "lon_1": -7.1490370375800003, "lon_1_pos": 352.85096296199998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc513-Crommelin.php", "FN_3D": "515-20110615-7247-3d-1-CrommelinCrater.tif", "FN_CO": "514-20110615-7247-co-CrommelinCrater.tif", "FN_3D2": null, "FN_AN": "516-20110615-7247-an-CrommelinCrater.tif", "FN_HT": "513-20110615-7247-ht-CrommelinCrater.tif", "FN_TXT": null, "FN_CTX": "513-20110615-7247-ctx-CrommelinCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "513-20110615-7247-nd-CrommelinCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -423757.007985667209141, 607008.199669408379123 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North Polar Ice Cap", "Orbit": 8160, "PR_Date": "2011-08-05", "Release_Nr": "517-519", "Year": 2011, "lat_1": 84.894649110800003, "lon_1": -24.2516583337, "lon_1_pos": 335.74834166599999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc517-NorthPolarIceCap.php", "FN_3D": null, "FN_CO": "518-20110707-8160-co-NorthIceCap.tif", "FN_3D2": null, "FN_AN": "519-20110707-8160-an-NorthIceCap.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "517-20110707-8160-ctxt-NorthIceCap.tif", "Comment": null, "FN_Video": null, "FN_ND": "517-20110707-8160-nd-NorthIceCap.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1437509.712166677694768, 5032104.64738763961941 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Eberswalde Crater", "Orbit": 7208, "PR_Date": "2011-09-02", "Release_Nr": "520-523", "Year": 2011, "lat_1": -25.1163040906, "lon_1": -33.823636684199997, "lon_1_pos": 326.17636331599999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc520-EberswaldeCrater.php", "FN_3D": "522-20110805-7208-3d-1-EberswaldeCrater.tif", "FN_CO": "521-20110805-7208-co-EberswaldeCrater.tif", "FN_3D2": null, "FN_AN": "523-20110805-7208-an-EberswaldeCrater.tif", "FN_HT": "520-20110805-7208-ht-EberswaldeCrater.tif", "FN_TXT": null, "FN_CTX": "520-20110805-7208-ctxt-EberswaldeCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": "520-20110805-7208-nd-EberswaldeCrater.tif", "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2004885.833593842573464, -1488761.327872092137113 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ares Vallis", "Orbit": 9393, "PR_Date": "2011-10-07", "Release_Nr": "524-527", "Year": 2011, "lat_1": 16.102417503800002, "lon_1": -32.579276611099999, "lon_1_pos": 327.42072338899999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc524-AresVallis.php", "FN_3D": "526-20110912-9393-3d-1-AresVallis.tif", "FN_CO": "525-20110912-9393-co-AresVallis.tif", "FN_3D2": null, "FN_AN": "527-20110912-9393-an-AresVallis.tif", "FN_HT": "524-20110912-9393-ht-AresVallis.tif", "FN_TXT": null, "FN_CTX": "524-20110912-9393-ctxt-AresVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": "524-20110912-9393-nd-AresVallis.tif", "Titel": "Ares Valles  – large outflow channel on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1931126.766648727236316, 954465.9269329092931 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tharsis Tholus", "Orbit": 0, "PR_Date": "2011-11-04", "Release_Nr": "528-530", "Year": 2011, "lat_1": 13.376980848300001, "lon_1": -91.661665013499999, "lon_1_pos": 268.338334987, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc528-TharsisTholus.php", "FN_3D": "529-20111011-mosaic-3d-1-TharsisTholus.tif", "FN_CO": null, "FN_3D2": null, "FN_AN": "530-20111011-mosaic-an-TharsisTholus.tif", "FN_HT": "528-20111011-mosaic-ht-TharsisTholus.tif", "FN_TXT": null, "FN_CTX": "528-20111011-mosaic-ctxt-TharsisTholus.tif", "Comment": null, "FN_Video": null, "FN_ND": "528-20111011-mosaic-nd-TharsisTholus.tif", "Titel": "Tharsis Tholus  – a collapsed 8000-metre peak", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5433217.468157236464322, 792916.49355904199183 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Phlegra Montes", "Orbit": 9465, "PR_Date": "2011-12-02", "Release_Nr": "531-534", "Year": 2011, "lat_1": 32.433127520500001, "lon_1": 162.04924735099999, "lon_1_pos": 162.04924735099999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc531-PhlegraMontes.php", "FN_3D": "533-20111109-9465-3d-1-PhlegraMontes.tif", "FN_CO": "532-20111109-9465-co-PhlegraMontes.tif", "FN_3D2": null, "FN_AN": "534-20111109-9465-an-PhlegraMontes.tif", "FN_HT": "531-20111109-9465-ht-PhlegraMontes.tif", "FN_TXT": null, "FN_CTX": "531-20111109-9465-ctxt-PhlegraMontes.tif", "Comment": "nadir files von 2011-2004", "FN_Video": null, "FN_ND": "531-20111109-9465-nd-PhlegraMontes.tif", "Titel": "Unusual flow patterns in Phlegra Montes", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9605420.120599921792746, 1922463.82351123704575 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tempe Terra", "Orbit": 9622, "PR_Date": "2012-01-06", "Release_Nr": "535-538", "Year": 2012, "lat_1": 43.489375631199998, "lon_1": -55.904111600599997, "lon_1_pos": 304.09588839899999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc535-TempeTerra.php", "FN_3D": "537-20111128-9622-3d-1-TempeTerra.tif", "FN_CO": "536-20111128-9622-co-TempeTerra.tif", "FN_3D2": null, "FN_AN": "538-20111128-9622-an-TempeTerra.tif", "FN_HT": "535-20111128-9622-ht-TempeTerra.tif", "FN_TXT": null, "FN_CTX": "535-20111128-9622-ctxt-TempeTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "\'Wrinkle ridges\' and grabens in Tempe Terra", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3313699.305432451423258, 2577819.58601562352851 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Syrtis Major", "Orbit": 9487, "PR_Date": "2012-02-02", "Release_Nr": "539-542", "Year": 2012, "lat_1": 16.1658373693, "lon_1": 73.126075060399998, "lon_1_pos": 73.126075060399998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc539-SyrtisMajor.php", "FN_3D": "541-20120117-9487-3d-1-SyrtisMajor.tif", "FN_CO": "540-20120117-9487-co-SyrtisMajor.tif", "FN_3D2": null, "FN_AN": "542-20120117-9487-an-SyrtisMajor.tif", "FN_HT": "539-20120117-9487-ht-SyrtisMajor.tif", "FN_TXT": null, "FN_CTX": "539-20120117-9487-ctxt-SyrtisMajor.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Syrtis Major – a dark spot on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4334525.980271192267537, 958225.120274562737904 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ius Chasma", "Orbit": 2149, "PR_Date": "2012-03-01", "Release_Nr": "543-546", "Year": 2012, "lat_1": -6.8563807671900001, "lon_1": -77.912988586099999, "lon_1_pos": 282.08701141400002, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc543-IusChasma.php", "FN_3D": "545-20120201-2149-3d-1-IusChasma.tif", "FN_CO": "544-20120201-2149-co-IusChasma.tif", "FN_3D2": null, "FN_AN": "546-20120201-2149-an-IusChasma.tif", "FN_HT": "543-20120201-2149-ht-IusChasma.tif", "FN_TXT": null, "FN_CTX": "543-20120201-2149-ctxt-IusChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The eight-kilometre-high scarp of Ius Chasma", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4618268.831576434895396, -406409.896079711441416 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tractus Catena", "Orbit": 9538, "PR_Date": "2012-04-05", "Release_Nr": "547-550", "Year": 2012, "lat_1": 23.153045366499999, "lon_1": -102.593685498, "lon_1_pos": 257.40631450199999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc547-TractusCatena.php", "FN_3D": "549-20120314-9538-3d-TractusCatena.tif", "FN_CO": "548-20120314-9538-co-TractusCatena.tif", "FN_3D2": null, "FN_AN": "550-20120314-9538-an-TractusCatena.tif", "FN_HT": "547-20120314-9538-ht-TractusCatena.tif", "FN_TXT": null, "FN_CTX": "547-20120314-9538-ctxt-TractusCatena.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Pit chains on the Tharsis volcanic bulge", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6081209.675683128647506, 1372389.760840618051589 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Acidalia Planitia", "Orbit": 9534, "PR_Date": "2012-05-03", "Release_Nr": "551-553", "Year": 2012, "lat_1": 37.3939874605, "lon_1": -53.229551836900001, "lon_1_pos": 306.77044816300003, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc551-AcidaliaPlanitia.php", "FN_3D": "552-20120423-9534-3d-AcidaliaPlanitia.tif", "FN_CO": "551-20120423-9534-co-AcidaliaPlanitia.tif", "FN_3D2": null, "FN_AN": "553-20120423-9534-an-AcidaliaPlabitia.tif", "FN_HT": "551-20120423-9534-ht-AcidaliaPlanitia.tif", "FN_TXT": null, "FN_CTX": "551-20120423-9534-ctxt-AcidaliaPlabitia.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mars Express – former lakes and rivers in Acidalia Planitia", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3155165.584431855939329, 2216517.29590981407091 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Danielson Crater", "Orbit": 10468, "PR_Date": "2012-06-07", "Release_Nr": "554-557", "Year": 2012, "lat_1": 7.3883802088000001, "lon_1": -7.1245214134800001, "lon_1_pos": 352.87547858699998, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc554-DanielsonCrater.php", "FN_3D": "556-20120514-10468-3d-DanielsonCrater.tif", "FN_CO": "555-20120514-10468-co-DanielsonCrater.tif", "FN_3D2": null, "FN_AN": "557-20120514-10468-an-DanielsonCrater.tif", "FN_HT": "554-20120514-10468-ht-DanielsonCrater.tif", "FN_TXT": null, "FN_CTX": "554-20120514-10468-ctxt-DanielsonCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Yardangs in Danielson Crater – indicators of climate changes on Mars?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -422303.851782238052692, 437944.00206351588713 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Melas Dorsa", "Orbit": 10532, "PR_Date": "2012-07-05", "Release_Nr": "558-561", "Year": 2012, "lat_1": -17.938916408800001, "lon_1": -72.406641793299997, "lon_1_pos": 287.59335820699999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc558-MelasDorsa.php", "FN_3D": "560-20120613-10532-3d-MelasDorsa.tif", "FN_CO": "559-20120613-10532-co-MelasDorsa.tif", "FN_3D2": null, "FN_AN": "561-20120613-10532-an-MelasDorsa.tif", "FN_HT": "558-20120613-10532-ht-MelasDorsa.tif", "FN_TXT": null, "FN_CTX": "558-20120613-10532-ctxt-MelasDorsa.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Melas Dorsa – butterfly ejecta and wrinkle ridges in Melas Dorsa", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4291881.790974546223879, -1063323.844029947649688 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ladon Valles", "Orbit": 10602, "PR_Date": "2012-08-02", "Release_Nr": "562-565", "Year": 2012, "lat_1": -17.663392219199999, "lon_1": -30.932868557900001, "lon_1_pos": 329.067131442, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc562-LadonValles.php", "FN_3D": "564-20120717-10602-3d-1-LadonValles.tif", "FN_CO": "563-20120717-10602-co-LadonValles.tif", "FN_3D2": null, "FN_AN": "565-20120717-10602-an-LadonValles.tif", "FN_HT": "562-20120717-10602-ht-LadonValles.tif", "FN_TXT": null, "FN_CTX": "562-20120717-10602-ctxt-LadonValles.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Vast volumes of water once flowed in Ladon Valles", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1833536.427300007781014, -1046992.231027339003049 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hadley Crater", "Orbit": 10572, "PR_Date": "2012-09-06", "Release_Nr": "566-569", "Year": 2012, "lat_1": -19.060890272200002, "lon_1": 157.1474973, "lon_1_pos": 157.1474973, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc566-HadleyCrater.php", "FN_3D": "568-20120808-10572-3d-1-HadleyCrater.tif", "FN_CO": "567-20120808-10572-co-HadleyCrater.tif", "FN_3D2": null, "FN_AN": "569-20120808-10572-an-HadleyCrater.tif", "FN_HT": "566-20120808-10572-ht-HadleyCrater.tif", "FN_TXT": null, "FN_CTX": "566-20120808-10572-ctxt-HadleyCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Hadley Crater – closing in on the Martian interior", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9314870.368998201563954, -1129828.505411789985374 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hooke Crater", "Orbit": 10743, "PR_Date": "2012-10-04", "Release_Nr": "570-573", "Year": 2012, "lat_1": -45.532568235100001, "lon_1": -46.149926803, "lon_1_pos": 313.85007319699997, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc570-HookeCrater.php", "FN_3D": "572-20120918-10743-3d-HookeCrater.tif", "FN_CO": "571-20120918-10743-co-HookeCrater.tif", "FN_3D2": null, "FN_AN": "573-20120918-10743-an-HookeCrater.tif", "FN_HT": "570-20120918-10743-ht-HookeCrater.tif", "FN_TXT": null, "FN_CTX": "570-20120918-10743-ctxt-HookeCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Ice-clad beauty on the \'Silver Island\' of Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2735522.951970678754151, -2698929.20959385856986 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nereidum Montes", "Orbit": 10736, "PR_Date": "2012-11-01", "Release_Nr": "574-577", "Year": 2012, "lat_1": -39.276473085699998, "lon_1": -49.566930753199998, "lon_1_pos": 310.43306924699999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc574-NereidumMontes.php", "FN_3D": "576-20121018-10736-3d-1-NereidumMontes.tif", "FN_CO": "575-20121018-10736-co-NereidumMontes.tif", "FN_3D2": null, "FN_AN": "577-20121018-10736-an-NereidumMontes.tif", "FN_HT": "574-20121018-10736-ht-NereidumMontes.tif", "FN_TXT": null, "FN_CTX": "574-20121018-10736-ctxt-NereidumMonte", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Signs of water, ice and wind in Nereidum Montes", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2938064.82755410252139, -2328101.06193797942251 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Charitum Montes", "Orbit": 10778, "PR_Date": "2012-12-06", "Release_Nr": "578-581", "Year": 2012, "lat_1": -52.872096142300002, "lon_1": -26.2294509874, "lon_1_pos": 333.77054901299999, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc578-CharitumMontes.php", "FN_3D": "580-20121120-10778-3d-1-CharitumMontes.tif", "FN_CO": "579-20121120-10778-co-CharitumMontes.tif", "FN_3D2": null, "FN_AN": "581-20121120-10778-an-CharitumMontes.tif", "FN_HT": "578-20121120-10778-ht-CharitumMontes.tif", "FN_TXT": null, "FN_CTX": "578-20121120-10778-ctx-CharitumMontes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Charitum Montes – winter atmosphere on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1554742.773479158757254, -3133977.506259999703616 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Reull Vallis", "Orbit": 10657, "PR_Date": "2013-01-17", "Release_Nr": "582-585", "Year": 2013, "lat_1": -40.752818729700003, "lon_1": 106.215677347, "lon_1_pos": 106.215677347, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc582-UpperReullVallis.php", "FN_3D": "584-20121211-10657-3d-1-UpperReullVallis.tif", "FN_CO": "583-20121211-10657-co-UpperReullVallis.tif", "FN_3D2": null, "FN_AN": "585-20121211-10657-an-UpperReullVallis.tif", "FN_HT": "582-20121211-10657-ht-UpperReullVallis.tif", "FN_TXT": null, "FN_CTX": "582-20121211-10657-ctxt-UpperReullVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Glacial transportation of rubble and boulders through Reull Vallis", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6295902.146975954063237, -2415611.003424597438425 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hesperia Planum", "Orbit": 11497, "PR_Date": "2013-02-14", "Release_Nr": "586-589", "Year": 2013, "lat_1": -3.5, "lon_1": 109.0, "lon_1_pos": 109.0, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc586-HesperiaPlanum.php", "FN_3D": "588-20130130-11497-3d-1-HesperiaPlanum.tif", "FN_CO": "587-20130130-11497-co-HesperiaPlanum.tif", "FN_3D2": null, "FN_AN": "589-20130130-11497-an-HesperiaPlanum.tif", "FN_HT": "586-20130130-11497-ht-HesperiaPlanum.tif", "FN_TXT": null, "FN_CTX": "586-20130130-11497-ctxt-HesperiaPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Hesperia Planum – fire and ice in the red valley", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6460942.03004038054496, -207461.441331571782939 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Gordii Dorsum", "Orbit": 11503, "PR_Date": "2013-03-07", "Release_Nr": "590-593", "Year": 2013, "lat_1": 3.1805428977700001, "lon_1": -144.65257356000001, "lon_1_pos": 215.34742644, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc590-GordiiDorsum.php", "FN_3D": "592-20130214-11503-3d-1-GordiiDorsum.tif", "FN_CO": "591-20130214-11503-co-GordiiDorsum.tif", "FN_3D2": null, "FN_AN": "593-20130214-11503-an-GordiiDorsum.tif", "FN_HT": "590-20130214-11503-ht-GordiiDorsum.tif", "FN_TXT": null, "FN_CTX": "590-20130214-11503-ctxt-GordiiDorsum.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Gordii Dorsum – wind a shaping force on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8574237.54375659301877, 188525.718225257616723 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Thaumasia Planum", "Orbit": 11467, "PR_Date": "2013-04-11", "Release_Nr": "594-597", "Year": 2013, "lat_1": -16.852340709100002, "lon_1": -63.644185342999997, "lon_1_pos": 296.355814657, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc594-ThaumasiaPlanum.php", "FN_3D": "596-20130308-11467-3d-ThaumasiaPlanum.tif", "FN_CO": "595-20130308-11467-co-ThaumasiaPlanum.tif", "FN_3D2": null, "FN_AN": "597-20130308-11467-an-ThaumasiaPlanum.tif", "FN_HT": "594-20130308-11467-ht-ThaumasiaPlanum.tif", "FN_TXT": null, "FN_CTX": "594-20130311-11467-ctxt-ThaumasiaPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Explosive \'twin\' craters on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3772489.835324841085821, -998917.398093100520782 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Sulci Gordii", "Orbit": 11531, "PR_Date": "2013-05-02", "Release_Nr": "598-604", "Year": 2013, "lat_1": 17.0, "lon_1": -126.0, "lon_1_pos": 234.0, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc598-SulciGordii.php", "FN_3D": "601-20130410-11531-3d-1-SulciGordii.tif", "FN_CO": "600-20130410-11531-co-SulciGordii.tif", "FN_3D2": null, "FN_AN": "604-20130410-11531-an-SulciGordii.tif", "FN_HT": "599-20130410-11531-ht-SulciGordii.tif", "FN_TXT": null, "FN_CTX": "598-20130410-11531-ctxt-SulciGordii.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Landslides and lava flows at Olympus Mons", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7468611.887936586514115, 1007669.857896205503494 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Olympus Mons SE", "Orbit": 11524, "PR_Date": "2013-07-04", "Release_Nr": "610-615", "Year": 2013, "lat_1": 14.5, "lon_1": -131.0, "lon_1_pos": 229.0, "Movie": null, "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc610-OlympusMonsSE.php", "FN_3D": "613-02130613-11524-3d-1-OlympusMonsSE.tif", "FN_CO": "612-02130613-11524-co-OlympusMonsSE.tif", "FN_3D2": null, "FN_AN": "615-02130613-11524-an-OlympusMonsSE.tif", "FN_HT": "611-02130613-11524-ht-OlympusMonsSE.tif", "FN_TXT": null, "FN_CTX": "610-02130613-11524-ctxt-OlympusMonsSE.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Lava flows at the foot of Olympus Mons", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -7764985.375553114339709, 859483.114087940310128 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tagus Valles", "Orbit": 11504, "PR_Date": "2013-08-02", "Release_Nr": "616-620", "Year": 2013, "lat_1": -4.5, "lon_1": 114.5, "lon_1_pos": 114.5, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2013/tagus1/index.html", "FN_3D": "619-20130715-11504-3d-1-TagusValles.tif", "FN_CO": "618-20130715-11504-co-TagusValles.tif", "FN_3D2": null, "FN_AN": "620-20130715-11504-an-TagusValles.tif", "FN_HT": "617-20130715-11504-ht-TagusValles.tif", "FN_TXT": null, "FN_CTX": "616-20130715-11504-ctxt-TagusValles.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Scenes from the ‘Middle Ages’ on Mars – Tagus Valles deposits in Hesperia Planum", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6786952.866418563760817, -266736.138854878081474 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Kasai Vallis: 10 year special", "Orbit": 0, "PR_Date": "2013-06-06", "Release_Nr": "606-609", "Year": 2013, "lat_1": 27.5, "lon_1": -65.0, "lon_1_pos": 295.0, "Movie": null, "URL_PR": "https://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc606-10JahreMarsExpress.php", "FN_3D": "608-mosaic-10YearsMEx-3d-KaseiMosaic.tif", "FN_CO": "609-mosaic-10YearsMEx-co-KaseiMosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "607-mosaic-10YearsMEx-ht-KaseiMosaic.tif", "FN_TXT": null, "FN_CTX": "606-mosaic-10YearsMEx-ctxt-KaseiMosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Kasai Valles – the floodwaters of Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3852855.339014907367527, 1630054.181890921201557 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Becquerel Crater", "Orbit": 0, "PR_Date": "2013-09-05", "Release_Nr": "621-627", "Year": 2013, "lat_1": 22.145846931800001, "lon_1": -7.8217675974400001, "lon_1_pos": 352.17823240299998, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2013/becquerel1/index.html", "FN_3D": "624-20130815-mosaic-3d-1-BequerelCrater.tif", "FN_CO": "623-20130815-mosaic-co-BequerelCrater.tif", "FN_3D2": null, "FN_AN": "627-20130815-mosaic-an-BequerelCrater.tif", "FN_HT": "622-20130815-mosaic-ht-BequerelCrater.tif", "FN_TXT": null, "FN_CTX": "621-20130815-mosaic-ctxt-BequerelCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "A \'radiant\' beauty – sulphurous sediments in Becquerel crater", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -463632.908435922174249, 1312688.378279075957835 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hebes Chasma", "Orbit": 0, "PR_Date": "2013-10-10", "Release_Nr": "628-633", "Year": 2013, "lat_1": -1.08848365959, "lon_1": -74.876229448199993, "lon_1_pos": 285.123770552, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2013/hebes1/index.html", "FN_3D": "631-20130918-mosaic-3d-1-HebesChasma.tif", "FN_CO": "630-20130918-mosaic-co-HebesChasma.tif", "FN_3D2": null, "FN_AN": "633-20130918-mosaic-an-HebesChasma.tif", "FN_HT": "629-20130918-mosaic-ht-HebesChasma.tif", "FN_TXT": null, "FN_CTX": "628-20130918-mosaic-ctxt-HebesChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "An eight-thousand-metre mountain with sulphate layers in Hebes Chasma", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4438265.852228839881718, -64519.539681332433247 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ismeniae Foassae", "Orbit": 11709, "PR_Date": "2013-11-14", "Release_Nr": "634-638", "Year": 2013, "lat_1": 39.8121673984, "lon_1": 42.702423300600003, "lon_1_pos": 42.702423300600003, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2013/ismeniae1/index.html", "FN_3D": "637-20131028-11709-3d-IsmeniaeFossae.tif", "FN_CO": "636-20131028-11709-co-IsmeniaeFossae.tif", "FN_3D2": null, "FN_AN": "638-20131028-11709-an-IsmeniaeFossae.tif", "FN_HT": "635-20131028-11709-ht-IsmeniaeFossae.tif", "FN_TXT": null, "FN_CTX": "634-20131028-11709-ctxt-IsmeniaeFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Rolling hills and broad valleys in Ismeniae Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2531173.224655818194151, 2359854.180287312716246 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Juventae Chasma", "Orbit": 12508, "PR_Date": "2013-12-12", "Release_Nr": "639-643", "Year": 2013, "lat_1": -3.6253129603100001, "lon_1": -61.8441069247, "lon_1_pos": 298.15589307499999, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2013/juventae1/index.html", "FN_3D": "642-20131128-12508-3d-JuventaeChasma.tif", "FN_CO": "641-20131128-12508-co-JuventaeChasma.tif", "FN_3D2": null, "FN_AN": "643-20131128-12508-an-JuventaeChasma.tif", "FN_HT": "640-20131128-12508-ht-JuventaeChasma.tif", "FN_TXT": null, "FN_CTX": "639-20131128-12508-ctxt-JuventaeChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mysterious sulphate mountains in Juventae Chasma", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3665790.73156152991578, -214889.329149935219903 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Kasei Valles Animation", "Orbit": 0, "PR_Date": "2014-01-14", "Release_Nr": "642", "Year": 2014, "lat_1": 27.505321864500001, "lon_1": -64.064434004099994, "lon_1_pos": 295.93556599599998, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/kasei1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "642-20141020-mosaic-mov-KaseiValles.avi", "FN_ND": null, "Titel": "Kasei Valles Movie – the floodwater of Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3797399.947594142518938, 1630369.633798106340691 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Claritas Rupes", "Orbit": 12600, "PR_Date": "2014-02-06", "Release_Nr": "643-647", "Year": 2014, "lat_1": -27.188851039, "lon_1": -104.936525817, "lon_1_pos": 255.06347418300001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/claritas1/index.html", "FN_3D": "646-20140123-12600-3d-ClaritasRupes.tif", "FN_CO": "645-20140123-12600-co-ClaritasRupes.tif", "FN_3D2": null, "FN_AN": "647-20140123-12600-an-ClaritasRupes.tif", "FN_HT": "644-20140123-12600-ht-ClaritasRupes.tif", "FN_TXT": null, "FN_CTX": "643-20140123-12600-ctxt-ClaritasRupes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Crustal rupture near Claritas Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6220080.826933563686907, -1611610.921343283262104 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mistretta Crater", "Orbit": 12593, "PR_Date": "2014-03-06", "Release_Nr": "648-652", "Year": 2014, "lat_1": -24.866595116900001, "lon_1": -109.03921663200001, "lon_1_pos": 250.96078336799999, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/mistretta1/index.html", "FN_3D": "651-20140219-12593-3d-MistrettaCrater.tif", "FN_CO": "650-20140219-12593-co-MistrettaCrater.tif", "FN_3D2": null, "FN_AN": "652-20140219-12593-an-MistrettaCrater.tif", "FN_HT": "649-20140219-12593-ht-MistrettaCrater.tif", "FN_TXT": null, "FN_CTX": "648-20140219-12593-ctxt-MistrettaCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Lava at the foot of Mistretta Crater", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6463266.584053359925747, -1473959.90398654807359 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Osuga Valles", "Orbit": 12624, "PR_Date": "2014-04-10", "Release_Nr": "653-657", "Year": 2014, "lat_1": -15.2791353259, "lon_1": -38.727957350700002, "lon_1_pos": 321.27204264900001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/osuga1/index.html", "FN_3D": "656-20140324-12624-3d-OsugaValles.tif", "FN_CO": "655-20140324-12624-co-OsugaValles.tif", "FN_3D2": null, "FN_AN": "657-20140324-12624-an-OsugaValles.tif", "FN_HT": "654-20140324-12624-ht-OsugaValles.tif", "FN_TXT": null, "FN_CTX": "653-20140324-12624-ctxt-OsugaValles.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Osuga Valles – Beauty from Chaos", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2295587.957660486921668, -905666.124862645752728 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Rabe Crater", "Orbit": 0, "PR_Date": "2014-05-15", "Release_Nr": "658-662", "Year": 2014, "lat_1": -43.643211375299998, "lon_1": 35.0507402267, "lon_1_pos": 35.0507402267, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/rabe1/index.html", "FN_3D": "661-20140408-mosaic-3d-RabeCrater.tif", "FN_CO": "660-20140408-mosaic-co-RabeCrater.tif", "FN_3D2": null, "FN_AN": "662-20140408-mosaic-an-RabeCrater.tif", "FN_HT": "659-20140408-mosaic-ht-RabeCrater.tif", "FN_TXT": null, "FN_CTX": "658-20140408-mosaic-ctxt-RabeCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Black dunes on the red planet", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2077622.024903059238568, -2586938.153218092396855 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Atlantis Chaos", "Orbit": 12724, "PR_Date": "2014-06-12", "Release_Nr": "663-667", "Year": 2014, "lat_1": -35.060949043599997, "lon_1": -179.126740278, "lon_1_pos": 180.873259722, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/atlantis1/index.html", "FN_3D": "666-20140522-mosaic-3d-AtlantisChaos.tif", "FN_CO": "665-20140522-mosaic-co-AtlantisChaos.tif", "FN_3D2": null, "FN_AN": "667-20140522-mosaic-an-AtlantisChaos.tif", "FN_HT": "664-20140522-mosaic-ht-AtlantisChaos.tif", "FN_TXT": null, "FN_CTX": "663-20140522-mosaic-ctxt-AtlantisChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Chaos in the Atlantis basin", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10617683.348338482901454, -2078227.14944075490348 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hellespontus Montes", "Orbit": 12750, "PR_Date": "2014-07-10", "Release_Nr": "668-672", "Year": 2014, "lat_1": -40.969187086300003, "lon_1": 45.085857691000001, "lon_1_pos": 45.085857691000001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/hellespontus1/index.html", "FN_3D": "671-20140624-12750-3d-HellespontusMontes.tif", "FN_CO": "670-20140624-12750-co-HellespontusMontes.tif", "FN_3D2": null, "FN_AN": "672-20140624-12750-an-HellespontusMontes.tif", "FN_HT": "669-20140624-12750-ht-HellespontusMontes.tif", "FN_TXT": null, "FN_CTX": "668-20140624-12750-ctxt-HellespontusMontes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Snow, ice and water shaped the landscape of Hellespontus Montes", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2672450.57721035880968, -2428436.172315966337919 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hellas Basin", "Orbit": 12690, "PR_Date": "2014-08-18", "Release_Nr": "673-677", "Year": 2014, "lat_1": -32.593758543900002, "lon_1": 57.158180937799997, "lon_1_pos": 57.158180937799997, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/hellas1/index.html", "FN_3D": "676-20140731-12690-3d-Hellas.tif", "FN_CO": "675-20140731-12690-co-Hellas.tif", "FN_3D2": null, "FN_AN": "677-20140731-12690-an-Hellas.tif", "FN_HT": "674-20140731-12690-ht-Hellas.tif", "FN_TXT": null, "FN_CTX": "673-20140731-12690-ctxt-Hellas.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Deep deep down in the Hellas basin", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3388033.886071799788624, -1931985.178838927764446 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Argyre Planitia", "Orbit": 13082, "PR_Date": "2014-09-18", "Release_Nr": "678-682", "Year": 2014, "lat_1": -44.303505452700001, "lon_1": -42.509329895199997, "lon_1_pos": 317.49067010499999, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/agyre1/index.html", "FN_3D": "681-20140901-13082-3d-Agyre.tif", "FN_CO": "680-20140901-13082-co-Agyre.tif", "FN_3D2": null, "FN_AN": "682-20140901-13082-an-Agyre.tif", "FN_HT": "679-20140901-13082-ht-Agyre.tif", "FN_TXT": null, "FN_CTX": "678-20140901-13082-ctxt-Agyre.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Deep winter in Argyre Planitia", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2519727.671458374708891, -2626076.884928207378834 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hydraotes Chaos Animation", "Orbit": 0, "PR_Date": "2014-10-16", "Release_Nr": "683-686", "Year": 2014, "lat_1": 1.29788952739, "lon_1": -35.326711685600003, "lon_1_pos": 324.67328831399999, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/hydraotes1/index.html", "FN_3D": "686-20141006-mosaic-3d-HydraotesChaos.tif", "FN_CO": "685-20141006-mosaic-co-HydraotesChaos.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "684-20141006-mosaic-ht-HydraotesChaos.tif", "FN_TXT": null, "FN_CTX": "683-20141006-mosaic-ctxt-HydraotesChaos.tif", "Comment": null, "FN_Video": "683-20141001-mosaic-mov-HydraotesChaos.avi", "FN_ND": null, "Titel": "Flight over the canyon-area Hydraotes Chaos", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2093980.149658916052431, 76932.009154821877019 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hellas Chaos", "Orbit": 12785, "PR_Date": "2014-11-27", "Release_Nr": "687-691", "Year": 2014, "lat_1": -47.935693748600002, "lon_1": 68.756945622399996, "lon_1_pos": 68.756945622399996, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/hellas_chaos1/index.html", "FN_3D": "690-20141030-12785-3d-HellasChaos.tif", "FN_CO": "689-20141030-12785-co-HellasChaos.tif", "FN_3D2": null, "FN_AN": "691-20141030-12785-an-HellasChaos.tif", "FN_HT": "688-20141030-12785-ht-HellasChaos.tif", "FN_TXT": null, "FN_CTX": "687-20141030-12785-ctxt-HellasChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Hellas Chaos covered by frost", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4075547.154394713696092, -2841373.747518087271601 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Becquerel Animation", "Orbit": 0, "PR_Date": "2014-12-18", "Release_Nr": "692", "Year": 2014, "lat_1": 22.142330637899999, "lon_1": -7.8190726690699996, "lon_1_pos": 352.18092733100002, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2014/becquerel_movie1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "692-20141212-mosaic-mov-Becquerel.avi", "FN_ND": null, "Titel": "Flight over Becquerel Crater", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -463473.167371632531285, 1312479.951024163048714 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nili Fossae", "Orbit": 13699, "PR_Date": "2015-01-22", "Release_Nr": "693-697", "Year": 2015, "lat_1": 23.7353299697, "lon_1": 75.450700316600006, "lon_1_pos": 75.450700316600006, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/nili_fossae1/index.html", "FN_3D": "696-20150113-13699-3d-NiliFossae.tif", "FN_CO": "695-20150113-13699-co-NiliFossae.tif", "FN_3D2": null, "FN_AN": "697-20150113-13699-an-NiliFossae.tif", "FN_HT": "694-20150113-13699-ht-NiliFossae.tif", "FN_TXT": null, "FN_CTX": "693-20150113-13699-ctxt-NiliFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Nili Fossae - a large graben system on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4472317.439188095740974, 1406904.504567296011373 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Phlegra Montes", "Orbit": 13670, "PR_Date": "2015-02-19", "Release_Nr": "698-702", "Year": 2015, "lat_1": 29.969340160600002, "lon_1": 160.57468584, "lon_1_pos": 160.57468584, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/phlegra_montes1/index.html", "FN_3D": "701-20150203-13670-3d-PhlegraMontes.tif", "FN_CO": "700-20150203-13670-co-PhlegraMontes.tif", "FN_3D2": null, "FN_AN": "702-20150203-13670-an-PhlegraMontes.tif", "FN_HT": "699-20150203-13670-ht-PhlegraMontes.tif", "FN_TXT": null, "FN_CTX": "698-20150203-13670-ctxt-PhlegraMontes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Phlegra Montes – metamorphosed by climate change?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9518015.933047471567988, 1776423.572991663357243 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Cydonia Mensae", "Orbit": 13816, "PR_Date": "2015-03-12", "Release_Nr": "703-707", "Year": 2015, "lat_1": 38.218805600800003, "lon_1": -6.3712607239099999, "lon_1_pos": 353.62873927599998, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/cydonia_mensae1/index.html", "FN_3D": "706-20150302-13816-3d-CydoniaMensae.tif", "FN_CO": "705-20150302-13816-co-CydoniaMensae.tif", "FN_3D2": null, "FN_AN": "707-20150302-13816-an-CydoniaMensae.tif", "FN_HT": "704-20150302-13816-ht-CydoniaMensae.tif", "FN_TXT": null, "FN_CTX": "703-20150302-13816-ctxt-CydoniaMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Was the north of Mars once covered by an ocean?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -377654.552251921151765, 2265408.141691874247044 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Arabia Terra", "Orbit": 13728, "PR_Date": "2015-04-23", "Release_Nr": "708-712", "Year": 2015, "lat_1": 24.281240385499999, "lon_1": -10.613460011200001, "lon_1_pos": 349.38653998900003, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/arabia_terra1/index.html", "FN_3D": "711-20150423-13728-3d-CraterGenerations.tif", "FN_CO": "710-20150423-13728-co-CraterGenerations.tif", "FN_3D2": null, "FN_AN": "712-20150423-13728-an-CraterGenerations.tif", "FN_HT": "709-20150423-13728-ht-CraterGenerations.tif", "FN_TXT": null, "FN_CTX": "708-20150423-13728-ctxt-CraterGenerations.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Crater generations in Arabia terra on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -629109.631838240777142, 1439263.179342482239008 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Siloe Patera", "Orbit": 13837, "PR_Date": "2015-05-21", "Release_Nr": "713-717", "Year": 2015, "lat_1": 35.297785157100002, "lon_1": 6.60713683053, "lon_1_pos": 6.60713683053, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/siloe_patera1/index.html", "FN_3D": "716-20150521-13837-3d-SiloePatera.tif", "FN_CO": "715-20150521-13837-co-SiloePatera.tif", "FN_3D2": null, "FN_AN": "717-20150521-13837-an-SiloePatera.tif", "FN_HT": "714-20150521-13837-ht-SiloePatera.tif", "FN_TXT": null, "FN_CTX": "713-20150521-13837-ctxt-SiloePatera.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Siloe Patera – a supervolcano on Mars?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 391636.037125016388018, 2092265.538428761297837 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ascuris Planum", "Orbit": 13785, "PR_Date": "2015-07-02", "Release_Nr": "718-722", "Year": 2015, "lat_1": 39.880666335500003, "lon_1": -79.330830299599995, "lon_1_pos": 280.6691697, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/ascuris_planum1/index.html", "FN_3D": "721-20150616-13785-3d-AscurisPlanum.tif", "FN_CO": "720-20150616-13785-co-AscurisPlanum.tif", "FN_3D2": null, "FN_AN": "722-20150616-13785-an-AscurisPlanum.tif", "FN_HT": "719-20150616-13785-ht-AscurisPlanum.tif", "FN_TXT": null, "FN_CTX": "718-20150616-13785-ctxt-AscurisPlanum.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Tectonic stress - faults and grabens in Ascuris Planum", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4702310.970279761590064, 2363914.434065553825349 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Atlantis Chaos Animation", "Orbit": 12724, "PR_Date": "2015-08-03", "Release_Nr": "723", "Year": 2015, "lat_1": -35.061375760700003, "lon_1": -179.128168445, "lon_1_pos": 180.871831555, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/atlantis_movie1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "723-20150716-mosaic-mov-AtlantisChaos.avi", "FN_ND": null, "Titel": "Chaos in the Atlantis basin", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10617768.002506112679839, -2078252.442968607414514 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Southern Hemisphere", "Orbit": 14150, "PR_Date": "2015-09-10", "Release_Nr": "724-727", "Year": 2015, "lat_1": -87.245034866699996, "lon_1": -53.167173042500004, "lon_1_pos": 306.832826958, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/southpole_broom1/index.html", "FN_3D": null, "FN_CO": "724-20150901-14150-co-SouthernHemisphere.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "727-20150901-14150-Viking-ctxt-SoHemisphere.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mars southern hemisphere in early summer time", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3151468.100262332241982, -5171423.052132737822831 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Minio Vallis", "Orbit": 14622, "PR_Date": "2015-10-15", "Release_Nr": "728-733", "Year": 2015, "lat_1": -7.0716453150799996, "lon_1": -152.026701495, "lon_1_pos": 207.973298505, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/minio_vallis1/index.html", "FN_3D": "731-20150922-14622-3d-SouthofMinioVallis.tif", "FN_CO": "730-20150922-14622-co-SouthofMinioVallis.tif", "FN_3D2": null, "FN_AN": "733-20150922-14622-an-SouthofMinioVallis.tif", "FN_HT": "729-20150922-14622-ht-SouthofMinioVallis.tif", "FN_TXT": null, "FN_CTX": "728-20150922-14622-ctxt-SouthofMinioVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Flash floods in Mangala Vallis and Minio Vallis on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9011336.746609453111887, -419169.637043576338328 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aurorae Chaos", "Orbit": 14635, "PR_Date": "2015-11-19", "Release_Nr": "734-738", "Year": 2015, "lat_1": -8.0357176098400007, "lon_1": -40.070438258000003, "lon_1_pos": 319.92956174199998, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/aurorae_chaos1/index.html", "FN_3D": "737-20151030-14635-3d-AuroraeChaos.tif", "FN_CO": "736-20151030-14635-co-AuroraeChaos.tif", "FN_3D2": null, "FN_AN": "738-20151030-14635-an-AuroraeChaos.tif", "FN_HT": "735-20151030-14635-ht-AuroraeChaos.tif", "FN_TXT": null, "FN_CTX": "734-20151030-14635-ctxt-AuroraeChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Aurorae Chaos – Gigantic chaotic terrain on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2375163.107371051330119, -476314.730705835623667 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aeolis Mensae", "Orbit": 14653, "PR_Date": "2015-12-21", "Release_Nr": "739-743", "Year": 2015, "lat_1": -4.9920425028200004, "lon_1": 146.58324778799999, "lon_1_pos": 146.58324778799999, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2015/aeolis_mensae1/index.html", "FN_3D": "742-20151211-14605-3d-AeolisMensae.tif", "FN_CO": "741-20151211-14605-co-AeolisMensae.tif", "FN_3D2": null, "FN_AN": "743-20151211-14605-an-AeolisMensae.tif", "FN_HT": "740-20151211-14605-ht-AeolisMensae.tif", "FN_TXT": null, "FN_CTX": "739-20151211-14605-ctxt-AeolisMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mesas and wind gullies in Aeolis Mensae on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8688677.674634521827102, -295901.809377997589763 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Noctis Labyrinthus", "Orbit": 14632, "PR_Date": "2016-01-28", "Release_Nr": "744-748", "Year": 2016, "lat_1": -6.0228083557299996, "lon_1": -95.036702801100006, "lon_1_pos": 264.96329719900001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/noctis_labyrinthus1/index.html", "FN_3D": "747-20160111-14632-3d-NoctisLabyrinthus.tif", "FN_CO": "746-20160111-14632-co-NoctisLabyrinthus.tif", "FN_3D2": null, "FN_AN": "748-20160111-14632-an-NoctisLabyrinthus.tif", "FN_HT": "745-20160111-14632-ht-NoctisLabyrinthus.tif", "FN_TXT": null, "FN_CTX": "744-20160111-14632-ctxt-NoctisLabyrinthus.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Kilometres-deep canyons in the \'Labyrinth of the Night\'", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5633271.812146005220711, -357000.143526584433857 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Arda Valles", "Orbit": 14649, "PR_Date": "2016-02-18", "Release_Nr": "749-753", "Year": 2016, "lat_1": -19.524817259599999, "lon_1": -32.609649656400002, "lon_1_pos": 327.39035034400001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/arda_valles1/index.html", "FN_3D": "752-20160208-14649-3d-ArdaValles.tif", "FN_CO": "751-20160208-14649-co-ArdaValles.tif", "FN_3D2": null, "FN_AN": "753-20160208-14649-an-ArdaValles.tif", "FN_HT": "750-20160208-14649-ht-ArdaValles.tif", "FN_TXT": null, "FN_CTX": "749-20160208-14649-ctxt-ArdaValles.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Arda Valles –  an ancient drainage system on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1932927.119721836876124, -1157327.637262797215953 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Western Hellas Terraces", "Orbit": 15127, "PR_Date": "2016-03-23", "Release_Nr": "754-758", "Year": 2016, "lat_1": -45.554204354299998, "lon_1": 48.734258839500001, "lon_1_pos": 48.734258839500001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/hellas_terraces1/index.html", "FN_3D": "757-20160310-15127-3d-WesternHellasTerraces..tif", "FN_CO": "756-20160310-15127-co-WesternHellasTerraces..tif", "FN_3D2": null, "FN_AN": "758-20160310-15127-an-WesternHellasTerraces..tif", "FN_HT": "755-20160310-15127-ht-WesternHellasTerraces..tif", "FN_TXT": null, "FN_CTX": "754-20160310-15127-ctxt-WesternHellasTerraces.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The icy terraces of the giant Hellas basin", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2888708.451735802926123, -2700211.684016285929829 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Memnonia Fossae", "Orbit": 14689, "PR_Date": "2016-04-28", "Release_Nr": "759-763", "Year": 2016, "lat_1": -22.632058838199999, "lon_1": -163.19441088299999, "lon_1_pos": 196.80558911700001, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/memnonia_fossae1/index.html", "FN_3D": "762-20160415-14689-3d-MemnoniaFossae.tif", "FN_CO": "761-20160415-14689-co-MemnoniaFossae.tif", "FN_3D2": null, "FN_AN": "763-20160415-14689-an-MemnoniaFossae.tif", "FN_HT": "760-20160415-14689-ht-MemnoniaFossae.tif", "FN_TXT": null, "FN_CTX": "759-20160415-14689-ctxt-MemnoniaFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "A \'split\' crater in Memnonia Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9673299.342567453160882, -1341508.441966084763408 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mare Serpentis", "Orbit": 14680, "PR_Date": "2016-06-02", "Release_Nr": "764-768", "Year": 2016, "lat_1": -34.860604701299998, "lon_1": 37.2366094944, "lon_1_pos": 37.2366094944, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/mare_serpentis1/index.html", "FN_3D": "767-20160519-14680-3d-MareSerpentis.tif", "FN_CO": "766-20160519-14680-co-MareSerpentis.tif", "FN_3D2": null, "FN_AN": "768-20160519-14680-an-MareSerpentis.tif", "FN_HT": "765-20160519-14680-ht-MareSerpentis.tif", "FN_TXT": null, "FN_CTX": "764-20160519-14680-ctxt-MareSerpentis.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Subsurface ice and rock glaciers in a central pit crater in Noachis Terra", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2207188.764574634842575, -2066351.799147219397128 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mawrth Vallis", "Orbit": 0, "PR_Date": "2016-07-07", "Release_Nr": "769-772", "Year": 2016, "lat_1": 23.080858019600001, "lon_1": -17.945621527699998, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/mawrth_mosaik1/index.html", "FN_3D": "772-20160616-mosaic-3d-Mawrth-Mosaic.tif", "FN_CO": "771-20160616-mosaic-co-Mawrth-Mosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "770-20160616-mosaic-ht-Mawrth-Mosaic.tif", "FN_TXT": null, "FN_CTX": "769-20160616-mosaic-ctxt-Mawrth-Mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Traces of water in one of the biggest valleys on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1063721.287923943018541, 1368110.877687477739528 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Schiaparell Landing Site Animation", "Orbit": 0, "PR_Date": "2016-08-11", "Release_Nr": "773-778", "Year": 2016, "lat_1": -2.2989265320099999, "lon_1": -6.0091553066800003, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/schiaparelli1/index.html", "FN_3D": "777-20160624-mosaic-3d-SchiaparelliEllipse.tif", "FN_CO": "775-20160624-mosaic-co-SchiaparelliEllipse.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "774-20160624-mosaic-ht-SchiaparelliEllipse.tif", "FN_TXT": null, "FN_CTX": "773-20160724-mosaic-ctxt-SchiaparelliEllipse.tif", "Comment": null, "FN_Video": "773-20160727-mosaic-mov-Schiaparelli.mp4", "FN_ND": null, "Titel": "Spotlight on the Schiaparelli landing site", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -356190.863173801160883, -136268.174813166464446 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Adamas Labyrinthus", "Orbit": 15804, "PR_Date": "2016-09-08", "Release_Nr": "779-783", "Year": 2016, "lat_1": 39.197418349099998, "lon_1": 101.527173617, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/adamas_labyrinthus1/index.html", "FN_3D": "782-20160811-15804-3d-AdamasLabyrinthus.tif", "FN_CO": "781-20160811-15804-co-AdamasLabyrinthus.tif", "FN_3D2": null, "FN_AN": "783-20160811-15804-an-AdamasLabyrinthus.tif", "FN_HT": "780-20160811-15804-ht-AdamasLabyrinthus.tif", "FN_TXT": null, "FN_CTX": "779-20160811-15804-ctxt-AdamasLabyrinthus.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "A former ocean within Utopia Planitia?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6017992.506566723808646, 2323415.116337416227907 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Colles Nili", "Orbit": 15727, "PR_Date": "2016-10-13", "Release_Nr": "784-788", "Year": 2016, "lat_1": 36.1027788763, "lon_1": 60.443747027299999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/colles_nili1/index.html", "FN_3D": "787-20160831-15727-3d-CollesNili.tif", "FN_CO": "786-20160831-15727-co-CollesNili.tif", "FN_3D2": null, "FN_AN": "788-20160831-15727-an-CollesNili.tif", "FN_HT": "785-20160831-15727-ht-CollesNili.tif", "FN_TXT": null, "FN_CTX": "784-20160831-15727-ctxt-CollesNili.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Glaciers in Colles Nili", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3582784.822215545922518, 2139981.297645423561335 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Acheron Fossae", "Orbit": 15641, "PR_Date": "2016-11-03", "Release_Nr": "789-793", "Year": 2016, "lat_1": 35.958476046100003, "lon_1": -141.4021252, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/acheron_fossae1/index.html", "FN_3D": "792-20161012-15641-3d-AcheronFossae.tif", "FN_CO": "791-20161012-15641-co-AcheronFossae.tif", "FN_3D2": null, "FN_AN": "793-20161012-15641-an-AcheronFossae.tif", "FN_HT": "790-20161012-15641-ht-AcheronFossae.tif", "FN_TXT": null, "FN_CTX": "789-20161012-15641-ctxt-AcheronFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Acheron Fossae – is it a rift system?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8381568.200405940413475, 2131427.791031404398382 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Mawrth Vallis Animation", "Orbit": 0, "PR_Date": "2016-12-08", "Release_Nr": "794", "Year": 2016, "lat_1": 23.0817085861, "lon_1": -17.946022104000001, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2016/mawrth_movie1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "794-20161110-mosaic-mov-MawrthValles.avi", "FN_ND": null, "Titel": "Flight over Mawrth vallis", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1063745.031963720917702, 1368161.294762558769435 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North Polar Ice Cap", "Orbit": 0, "PR_Date": "2017-02-02", "Release_Nr": "798", "Year": 2017, "lat_1": 88.005115050300006, "lon_1": 6.0172909488900004, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/north_polar_mosaic1/index.html", "FN_3D": "800-20160113-3d-1-north-pole-mosaic.tif", "FN_CO": "799-20160113-co-north-pole-mosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "798-20160113-ctxt-north-pole-mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Clear view of the Mars north polar ice cap", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 356673.100905225554015, 5216476.575110248290002 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Worcester Crater", "Orbit": 15714, "PR_Date": "2017-03-02", "Release_Nr": "799-803", "Year": 2017, "lat_1": 27.168665809299998, "lon_1": -50.7533654279, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/worcester_crater1/index.html", "FN_3D": "802-20170209-15714-3d-WorcesterCrater.tif", "FN_CO": "801-20170209-15714-co-WorcesterCrater.tif", "FN_3D2": null, "FN_AN": "803-20170209-15714-an-WorcesterCrater.tif", "FN_HT": "800-20170209-15714-ht-WorcesterCrater.tif", "FN_TXT": null, "FN_CTX": "799-20170228-15714-ctxt-WorcesterCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Martian mega-floods at Worcester crater", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3008390.38403141964227, 1610414.447959214448929 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Terra Sirenum", "Orbit": 16565, "PR_Date": "2017-04-06", "Release_Nr": "804-808", "Year": 2017, "lat_1": -26.1804634784, "lon_1": -161.45519983899999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/terra_sirenum1/index.html", "FN_3D": "807-20170316-16565-3d-TerraSirenum.tif", "FN_CO": "806-20170316-16565-co-TerraSirenum.tif", "FN_3D2": null, "FN_AN": "808-20170316-16565-an-TerraSirenum.tif", "FN_HT": "805-20170316-16565-ht-TerraSirenum.tif", "FN_TXT": null, "FN_CTX": "804-20170327-16565-ctxt-TerraSirenum.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Three at one stroke in Terra Sirenum on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9570208.134043209254742, -1551839.053699414478615 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North Polar Ice Cap Animation", "Orbit": 0, "PR_Date": "2017-05-11", "Release_Nr": "809", "Year": 2017, "lat_1": 87.977592217600005, "lon_1": 0.20149600374000001, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/north_polar_movie1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "809-20170413-mosaic-mov-NorthPolarCap.mp4", "FN_ND": null, "Titel": "Flight over the north polar ice cap of Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 11943.614673622616465, 5214845.16752795688808 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Erythraeum Chaos", "Orbit": 0, "PR_Date": "2017-06-08", "Release_Nr": "810-814", "Year": 2017, "lat_1": -23.472954925500002, "lon_1": -13.4015916031, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/erythraeum_chaos1/index.html", "FN_3D": "813-20170515-3d-ErythraeumChaos.tif", "FN_CO": "812-20170515-co-ErythraeumChaos.tif", "FN_3D2": null, "FN_AN": "814-20170515-an-ErythraeumChaos.tif", "FN_HT": "811-20170517-ht-ErythraeumChaos.tif", "FN_TXT": null, "FN_CTX": "810-20170517-ctxt-ErythraeumChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Chaos and water on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -794375.288605161942542, -1391352.303187841549516 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Libya Montes", "Orbit": 16647, "PR_Date": "2017-07-13", "Release_Nr": "815-819", "Year": 2017, "lat_1": 1.3103762378899999, "lon_1": 89.644831590099997, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/libya_montes1/index.html", "FN_3D": "818-20170616-16647-3d-LibyaMontes.tif", "FN_CO": "817-20170616-16647-co-LibyaMontes.tif", "FN_3D2": null, "FN_AN": "819-20170616-16647-an-LibyaMontes.tif", "FN_HT": "816-20170616-16647-ht-LibyaMontes.tif", "FN_TXT": null, "FN_CTX": "815-20170616-16647-ctxt-LibyaMontes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Ancient fluvial activity in Libya Montes", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 5313670.277032007463276, 77672.155142798059387 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Coracis Fossae", "Orbit": 16807, "PR_Date": "2017-08-10", "Release_Nr": "820-824", "Year": 2017, "lat_1": -31.377321865599999, "lon_1": -78.517591830300006, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/coracis_fossae1/index.html", "FN_3D": "823-20170718-16807-3d-CoracisFossae.tif", "FN_CO": "822-20170718-16807-co-CoracisFossae.tif", "FN_3D2": null, "FN_AN": "824-20170718-16807-an-CoracisFossae.tif", "FN_HT": "821-20170718-16807-ht-CoracisFossae.tif", "FN_TXT": null, "FN_CTX": "820-20170718-16807-ctxt-CoracisFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Varying Martian landscape in Coracis Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4654106.506000088527799, -1859881.262675015022978 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North of Hellas", "Orbit": 16890, "PR_Date": "2017-09-14", "Release_Nr": "825-829", "Year": 2017, "lat_1": -21.457701867800001, "lon_1": 70.084607838899998, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/north_hellas1/index.html", "FN_3D": "828-20170823-16890-3d-North-of-Hellas.tif", "FN_CO": "827-20170823-16890-co-North-of-Hellas.tif", "FN_3D2": null, "FN_AN": "829-20170823-16890-an-North-of-Hellas.tif", "FN_HT": "826-20170823-16890-ht-North-of-Hellas.tif", "FN_TXT": null, "FN_CTX": "825-20170823-16890-ctxt-North-of-Hellas.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Splashdown! Crashing into Martian mud", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4154243.930691078770906, -1271898.787761628627777 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aonia Terra", "Orbit": 16934, "PR_Date": "2017-10-05", "Release_Nr": "830-834", "Year": 2017, "lat_1": -59.001496631899997, "lon_1": -111.564250906, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/aonia_terra1/index.html", "FN_3D": "833-20170914-16934-3d-AoniaTerra.tif", "FN_CO": "832-20170914-16934-co-AoniaTerra.tif", "FN_3D2": null, "FN_AN": "834-20170914-16934-an-AoniaTerra.tif", "FN_HT": "831-20170914-16934-ht-AoniaTerra.tif", "FN_TXT": null, "FN_CTX": "830-20170914-16934-ctxt-AoniaTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Diverse dune landscape on desert planet Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6612937.226878637447953, -3497295.866277722176164 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Sirenum Fossae", "Orbit": 16688, "PR_Date": "2017-11-16", "Release_Nr": "835-839", "Year": 2017, "lat_1": -28.371126091299999, "lon_1": -144.692366967, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/sirenum_fossae1/index.html", "FN_3D": "838-20171018-16688-3d-SirenumFossae.tif", "FN_CO": "837-20171018-16688-co-SirenumFossae.tif", "FN_3D2": null, "FN_AN": "839-20171018-16688-an-SirenumFossae.tif", "FN_HT": "836-20171018-16688-ht-SirenumFossae.tif", "FN_TXT": null, "FN_CTX": "835-20171018-16688-ctxt-SirenumFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Fractured Martian crust in Sirenum Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -8576596.285902488976717, -1681689.917456266935915 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Limb Calibration", "Orbit": 17050, "PR_Date": "2017-12-14", "Release_Nr": "840-842", "Year": 2017, "lat_1": 65.412921293099998, "lon_1": -111.162226846, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2017/northern_hemisphere1/index.html", "FN_3D": null, "FN_CO": "842-20171120-17050-co-NoHemisphere.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "841_20171120-17050-ctxt-Viking-NoHemisphere.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mars upside down", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6589107.372289890423417, 3877331.123765177093446 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Neukum Crater", "Orbit": 0, "PR_Date": "2018-01-18", "Release_Nr": "843-847", "Year": 2018, "lat_1": -44.9157139653, "lon_1": 29.308919745099999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/neukum_crater1/index.html", "FN_3D": "846-20171215-3d-NeukumCrater-mosaic.tif", "FN_CO": "845-20171215-co-NeukumCrater-mosaic.tif", "FN_3D2": null, "FN_AN": "847-20171215-an-NeukumCrater-mosaic.tif", "FN_HT": "844-20171215-ht-NeukumCrater-mosaic.tif", "FN_TXT": null, "FN_CTX": "843-20171215-ctxt-NeukumCrater-mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The Neukum Crater on Mars – Martian crater named after German planetary scientist", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1737277.352623168146238, -2662556.68516992405057 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ismenia Patera", "Orbit": 17723, "PR_Date": "2018-04-12", "Release_Nr": "852-856", "Year": 2018, "lat_1": 38.562723570700001, "lon_1": 1.8378589168299999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/ismenia_patera1/index.html", "FN_3D": "856-20180316-17723-3d-IsmeniaPatera.tif", "FN_CO": "854-20180316-17723-co-IsmeniaPatera.tif", "FN_3D2": null, "FN_AN": "855-20180316-17723-an-IsmeniaPatera.tif", "FN_HT": "853-20180316-17723-ht-IsmeniaPatera.tif", "FN_TXT": null, "FN_CTX": "852-20180316-17723-ctxt-IsmeniaPatera.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Ismenia Patera – impact crater or supervolcano?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 108938.531385412992677, 2285793.775330913253129 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Neukum Crater Animation", "Orbit": 0, "PR_Date": "2018-05-17", "Release_Nr": "857", "Year": 2018, "lat_1": -44.939668006799998, "lon_1": 27.334233544100002, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/neukum_crater_movie1/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "857-20180417-mosaic-mov-NeukumCrater.mp4", "FN_ND": null, "Titel": "Flight over Neukum Crater on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1620228.425357838626951, -2669426.472359200473875 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "15 years special", "Orbit": 17444, "PR_Date": "2018-06-01", "Release_Nr": "859-861", "Year": 2018, "lat_1": 27.292331770099999, "lon_1": -117.772067994, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_15_years_mex/index.html", "FN_3D": null, "FN_CO": "858-20180509-17444-co-15YearsHRSC.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "860-20180509-17444-ctxt-MOLA-15YearsHRSC.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "15 Years HRSC on Mars Express – Mars from horizon to horizon", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6980903.707041639834642, 1617744.71037761028856 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "dust storm", "Orbit": 18039, "PR_Date": "2018-07-19", "Release_Nr": "862-863", "Year": 2018, "lat_1": 78.573140549499996, "lon_1": 106.894180187, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_dust_storm/index.html", "FN_3D": null, "FN_CO": "862-20180702-18039-co-dust-storm.tif", "FN_3D2": null, "FN_AN": "863-20180702-18039-an-dust-storm.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Announcing this year\'s dust storm season on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6336120.19759990926832, 4657399.139529451727867 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Cerberus Fossae", "Orbit": 17813, "PR_Date": "2018-09-20", "Release_Nr": "868-873", "Year": 2018, "lat_1": 9.74295702619, "lon_1": 159.03252152300001, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_cerberus_fossae/index.html", "FN_3D": "871-20180931-17813-3d-1-CerberusFossae.tif", "FN_CO": "870-20180931-17813-co-CerberusFossae.tif", "FN_3D2": "872-20180931-17813-3d-2-CerberusFossae.tif", "FN_AN": "873-20180931-17813-an-CerberusFossae.tif", "FN_HT": "869-20180931-17813-ht-CerberusFossae.tif", "FN_TXT": null, "FN_CTX": "868-20180931-17813-ctxt-CerberusFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Recent tectonics on Mars in the Ceberus Fossae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9426604.609638063237071, 577510.830710074398667 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Greeley Crater", "Orbit": 0, "PR_Date": "2018-10-26", "Release_Nr": "864-867", "Year": 2018, "lat_1": -36.8351371181, "lon_1": 3.638701859, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_greeley_crater/index.html", "FN_3D": "867-20180813-3d-GreeleyCrater-mosaic.tif", "FN_CO": "866-20180813-co-GreeleyCrater-mosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "865-20180813-ht-GreeleyCrater-mosaic.tif", "FN_TXT": null, "FN_CTX": "864-20180813-ctxt-GreeleyCrater-mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Major crater pays tribute to a leading planetary scientist", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 215682.952069823862985, -2183391.610903075896204 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North of Nili Fossae", "Orbit": 17916, "PR_Date": "2018-11-22", "Release_Nr": "874-878", "Year": 2018, "lat_1": 28.289082410799999, "lon_1": 78.177731663499998, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_north_of_nili/index.html", "FN_3D": "877-20181029-17916-3d-North-of-NiliFossae.tif", "FN_CO": "876-20181029-17916-co-North-of-NiliFossae.tif", "FN_3D2": null, "FN_AN": "878-20181029-17916-an-North-of-NiliFossae.tif", "FN_HT": "875-20181029-17916-ht-North-of-NiliFossae.tif", "FN_TXT": null, "FN_CTX": "874-20181029-17916-ctxt-North-of-NiliFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "From hills to valleys – material transport on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4633961.397409368306398, 1676826.803109407424927 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Korolev Crater", "Orbit": 0, "PR_Date": "2018-12-20", "Release_Nr": "879-882", "Year": 2018, "lat_1": 72.857864387600003, "lon_1": 164.61769076300001, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2018/2018_korolev_crater/index.html", "FN_3D": "882-20181128-3d-KorolevCrater-mosaic.tif", "FN_CO": "881-20181128-co-KorolevCrater-mosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "880-20181128-ht-KorolevCrater-mosaic.tif", "FN_TXT": null, "FN_CTX": "879-20181128-ctxt-KorolevCrater-mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Winter wonderland in red and white", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 9757663.82698973827064, 4318627.87376709934324 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "East of Huygens", "Orbit": 18831, "PR_Date": "2019-02-21", "Release_Nr": "883-887", "Year": 2019, "lat_1": -17.414167648700001, "lon_1": 66.642242748000001, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_east_of_huygens/index.html", "FN_3D": "886-20190205-18831-3d-EastOfHuygens.tif", "FN_CO": "885-20190205-18831-co-EastOfHuygens.tif", "FN_3D2": null, "FN_AN": "887-20190205-18831-an-EastOfHuygens.tif", "FN_HT": "884-20190205-18831-ht-EastOfHuygens.tif", "FN_TXT": null, "FN_CTX": "883-20190205-18831-ctxt-EastOfHuygens.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Signs of ancient flowing on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 3950198.781161940190941, -1032219.519996222807094 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Chalcoporos Rupes", "Orbit": 18983, "PR_Date": "2019-03-28", "Release_Nr": "888-892", "Year": 2019, "lat_1": -53.003497419399999, "lon_1": 22.9387998855, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_dustdevils/index.html", "FN_3D": "891-20190312-18983-3d-ChalcoporosRupes.tif", "FN_CO": "890-20190312-18983-co-ChalcoporosRupes.tif", "FN_3D2": null, "FN_AN": "892-20190312-18983-an-ChalcoporosRupes.tif", "FN_HT": "889-20190312-18983-ht-ChalcoporosRupes.tif", "FN_TXT": null, "FN_CTX": "888-20190312-18983-ctxt-ChalcoporosRupes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Who left the dark tracks on Mars?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1359690.424759030807763, -3141766.277211475651711 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Lowell Crater", "Orbit": 0, "PR_Date": "2019-05-16", "Release_Nr": "893-896", "Year": 2019, "lat_1": -52.025295578600002, "lon_1": -81.288203623900003, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_lowell_crater/index.html", "FN_3D": "896-20190509-mosaic-3d-LowellCrater-mosaic.tif", "FN_CO": "895-20190426-mosaic-co-LowellCrater-mosaic.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "894-20190426-mosaic-ht-LowellCrater-mosaic.tif", "FN_TXT": null, "FN_CTX": "893-20190426-mosaic-ctxt-LowellCrater-mosaic.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The Martian impact crater Lowell", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4818333.68202224560082, -3083783.658982406836003 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aurorae Chaos", "Orbit": 18765, "PR_Date": "2019-06-27", "Release_Nr": "897-901", "Year": 2019, "lat_1": -10.9805105037, "lon_1": -33.602391924599999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_aurorae_chaos/index.html", "FN_3D": "900-20190611-18765-3d-AuroraeChaos.tif", "FN_CO": "899-20190611-18765-co-AuroraeChaos.tif", "FN_3D2": null, "FN_AN": "901-20190611-18765-an-AuroraeChaos.tif", "FN_HT": "898-20190611-18765-ht-AuroraeChaos.tif", "FN_TXT": null, "FN_CTX": "897-20190611-18765-cxtx-AuroraeChaos.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Aurorae Chaos – catastrophic collapse by water masses?", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -1991771.617391897831112, -650866.438757016439922 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Terra Cimmeria", "Orbit": 18904, "PR_Date": "2019-08-08", "Release_Nr": "902-907", "Year": 2019, "lat_1": -39.619139756599999, "lon_1": 170.84704476799999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_terra_cimmeria/index.html", "FN_3D": "905-20190716-18904-3d-1-TerraCimmeria.tif", "FN_CO": "904-20190716-18904-co-TerraCimmeria.tif", "FN_3D2": null, "FN_AN": "907-20190716-18904-an-TerraCimmeria.tif", "FN_HT": "903-20190716-18904-ht-TerraCimmeria.tif", "FN_TXT": null, "FN_CTX": "902-20190716-18904-ctxt-TerraCimmeria.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Dark meets light on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 10126906.901386739686131, -2348412.525208375882357 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Total Mars", "Orbit": 19550, "PR_Date": "2019-09-19", "Release_Nr": "908-910", "Year": 2019, "lat_1": 26.451782119400001, "lon_1": 43.984998945900003, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_total_mars/index.html", "FN_3D": null, "FN_CO": "910-20190826-19550-co-TotalMars.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "909-20190826-19550-ctxt-Viking-TotalMars.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Marvellous Mars – from the north pole to the southern highlands", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2607197.508078592829406, 1567921.384079769253731 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nirgal Vallis", "Orbit": 18818, "PR_Date": "2019-10-10", "Release_Nr": "911-915", "Year": 2019, "lat_1": -27.162424707, "lon_1": -45.280733171900003, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_nirgal_vallis/index.html", "FN_3D": "914-20190923-18818-3d-NirgalVallis.tif", "FN_CO": "913-20190923-18818-co-NirgalVallis.tif", "FN_3D2": null, "FN_AN": "915-20190923-18818-an-NirgalVallis.tif", "FN_HT": "912-20190923-18818-ht-NirgalVallis.tif", "FN_TXT": null, "FN_CTX": "911-20190923-18818-ctxt-NirgalVallis.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The Nirgal Vallis river valley on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2684001.762398619670421, -1610044.508504696656018 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Deuteronilus Mensae", "Orbit": 17913, "PR_Date": "2019-11-21", "Release_Nr": "916-921", "Year": 2019, "lat_1": 43.788126389, "lon_1": 25.7243637664, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/press/archiv2019/2019_deuteronilus/index.html", "FN_3D": "919-20191028-17913-3d1-DeuteronilusMensae.tif", "FN_CO": "918-20191028-17913-co-DeuteronilusMensae.tif", "FN_3D2": null, "FN_AN": "921-20191028-17913-an-DeuteronilusMensae.tif", "FN_HT": "917-20191028-17913-ht-DeuteronilusMensae.tif", "FN_TXT": null, "FN_CTX": "916-20191028-17913-ctxt-DeuteronilusMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Glacial landforms in Deuteronilus Mensae", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1524803.881233569001779, 2595527.946818721480668 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nereidum Montes", "Orbit": 14709, "PR_Date": "2020-09-03", "Release_Nr": "945-949", "Year": 2020, "lat_1": -34.088337408699999, "lon_1": -57.975791789200002, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_sumgin/index.html", "FN_3D": "948-20200818-14707-3d-NereidumMontes.tif", "FN_CO": "947-20200818-14707-co-NereidumMontes.tif", "FN_3D2": null, "FN_AN": "949-20200818-14707-an-NereidumMontes.tif", "FN_HT": "946-20200818-14707-ht-NereidumMontes.tif", "FN_TXT": null, "FN_CTX": "945-20200818-14707-ctxt-NereidumMontes.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The Nereidum Montes – mountain range on Mars show off", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -3436497.52197774592787, -2020575.888971365056932 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Nilosyrtis Mensae", "Orbit": 19908, "PR_Date": "2020-02-13", "Release_Nr": "922-926", "Year": 2020, "lat_1": 34.654252745100003, "lon_1": 67.968916307499995, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_nilosyrtis_mensae/index.html", "FN_3D": "925-20191125-19908-3d-NilosyrtisMensae.tif", "FN_CO": "924-20191125-19908-co-NilosyrtisMensae.tif", "FN_3D2": null, "FN_AN": "926-20191125-19908-an-NilosyrtisMensae.tif", "FN_HT": "923-20191125-19908-ht-NilosyrtisMensae.tif", "FN_TXT": null, "FN_CTX": "922-20191125-19908-ctx-NilosyrtisMensae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Nilosyrtis Mensae – erosion on a large scale", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4028836.955114278942347, 2054120.349364871159196 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Pyrrhae Regio", "Orbit": 20972, "PR_Date": "2020-11-19", "Release_Nr": "956-960", "Year": 2020, "lat_1": -14.805228549100001, "lon_1": -38.059731893399999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_pyrrhae_regio/index.html", "FN_3D": "959-20201030-20972-3d-PyrrhaeRegio.tif", "FN_CO": "957-20201030-20972-co-PyrrhaeRegio.tif", "FN_3D2": null, "FN_AN": "960-20201030-20972-an-PyrrhaeRegio.tif", "FN_HT": "958-20201030-20972-ht-PyrrhaeRegio.tif", "FN_TXT": null, "FN_CTX": "956-20201030-20972-ctxt-PyrrhaeRegio.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Birth of chaos – craters and collapses in Pyrrhae regio", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -2255979.095799747854471, -877575.444009809405543 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "East of Le Verrier", "Orbit": 20982, "PR_Date": "2020-10-29", "Release_Nr": "951-955", "Year": 2020, "lat_1": -36.855934740499997, "lon_1": 19.383662444300001, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_verrier_triple/index.html", "FN_3D": "954-20200828-20982-3d-EastOfLeVerrier.tif", "FN_CO": "953-20200828-20982-co-EastOfLeVerrier.tif", "FN_3D2": null, "FN_AN": "955-20200828-20982-an-EastOfLeVerrier.tif", "FN_HT": "952-20200828-20982-ht-EastOfLeVerrier.tif", "FN_TXT": null, "FN_CTX": "951-20200828-20982-ctxt-EastOfLeVerrier.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Crater triplets east of Le Verrier on Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 1148960.72828049166128, -2184624.383683640975505 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Polar Clouds", "Orbit": 3670, "PR_Date": "2020-01-13", "Release_Nr": "928-930", "Year": 2020, "lat_1": 85.145167064199995, "lon_1": 115.18867011099999, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_polar_clouds/index.html", "FN_3D": null, "FN_CO": "929-20191217-3670-co-PolarClouds.tif", "FN_3D2": null, "FN_AN": "930-20191217-3670-an-PolarClouds.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "928-20191217-3670-ctxt-PolarClouds.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Cloud Formations at the north polar ice cap of Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6827773.578958801925182, 5046954.023300101049244 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Moreux Crater", "Orbit": 20014, "PR_Date": "2020-03-05", "Release_Nr": "931-936", "Year": 2020, "lat_1": 41.776887507200001, "lon_1": 44.546640767600003, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_moreux_crater/index.html", "FN_3D": "934-20200220-20014-3d1-MoreuxCrater.tif", "FN_CO": "933-20200220-20014-co-MoreuxCrater.tif", "FN_3D2": null, "FN_AN": "936-20200220-20014-an-MoreuxCrater.tif", "FN_HT": "932-20200220-20014-ht-MoreuxCrater.tif", "FN_TXT": null, "FN_CTX": "931-20200220-20014-ctxt-MoreuxCrater.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Mars crater Moreux and its dark dunes", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 2640488.657178595662117, 2476312.37045180844143 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "North of Labeatis Fossae", "Orbit": 19913, "PR_Date": "2020-05-14", "Release_Nr": "938-942", "Year": 2020, "lat_1": 35.561895065599998, "lon_1": -80.124075497199996, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_labeatis_fossae/index.html", "FN_3D": "941-20200420-19913-3d-NorthOfLabeatisFossae.tif", "FN_CO": "940-20200420-19913-co-NorthOfLabeatisFossae.tif", "FN_3D2": null, "FN_AN": "942-20200420-19913-an-NorthOfLabeatisFossae.tif", "FN_HT": "939-20200420-19913-ht-NorthOfLabeatisFossae.tif", "FN_TXT": null, "FN_CTX": "938-20200420-19913-ctxt-NorthOfLabeatisFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "North of Labeatis Fossae – sculpted by nature", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4749330.339430654421449, 2107920.573369638063014 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Jezero Crater Animation", "Orbit": 0, "PR_Date": "2020-07-29", "Release_Nr": "944", "Year": 2020, "lat_1": 18.440222637000002, "lon_1": 77.743953676700002, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/animations_rd/jezero_crater/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": "950-20200923-topographic-map-JezeroCrater.jpg", "FN_TXT": null, "FN_CTX": null, "Comment": "Topo map von PR (29.09.2020)", "FN_Video": "944-20202907-mosaic-mov-JezeroCrater.mp4", "FN_ND": null, "Titel": "Jezero Crater – german stereo camera HRSC flies over NASA\'s Mars 2020 landing site", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4608249.338454782031476, 1093038.619073153007776 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Dark Angel", "Orbit": 21305, "PR_Date": "2020-12-17", "Release_Nr": "961-966", "Year": 2020, "lat_1": -77.984375950599997, "lon_1": 149.27970920300001, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2020_dark_angel/index.html", "FN_3D": "964-20201208-21305-3d-1-DarkAngel.tif", "FN_CO": "963-20201208-21305-co-DarkAngel.tif", "FN_3D2": null, "FN_AN": "966-20201208-21305-an-DarkAngel.tif", "FN_HT": "962-20201208-21305-ht-DarkAngel.tif", "FN_TXT": null, "FN_CTX": "961-20201208-21305-ctxt-DarkAngel.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Dark Angel – big heart – Mars is ready for christmas", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 8848509.609347393736243, -4622500.296014021150768 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Korolev Crate Animation", "Orbit": 0, "PR_Date": "2020-07-02", "Release_Nr": "943", "Year": 2020, "lat_1": 62.885076207200001, "lon_1": -173.06307061000001, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/animations_rd/korolev_crater/index.html", "FN_3D": null, "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": null, "Comment": null, "FN_Video": "943-20200625-mosaic-mov-KorolevCrater.mp4", "FN_ND": null, "Titel": "Flight over the ice-filled Koroloev Crater", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -10258261.162850800901651, 3727493.870909399352968 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Ius and Tithonium Chasma", "Orbit": 23123, "PR_Date": "2022-07-20", "Release_Nr": "1000-1007", "Year": 2022, "lat_1": -5.7153446924900004, "lon_1": -85.331940781499995, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_Ius_and_Tithonium_Chasma_unequal_siblings/index.html", "FN_3D": "1004-20220616-23123-3d-1-TithoniumChasma.tif", "FN_CO": "1002-20220616-23123-co-1-TithoniumChasma.tif", "FN_3D2": null, "FN_AN": "1007-20220616-23123-an-TithoniumChasma.tif", "FN_HT": "1001-20220616-23123-ht-TithoniumChasma.tif", "FN_TXT": null, "FN_CTX": "1000-20220616-23123-ctxt-TithoniumChasma.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Ius and Tithonium Chasma – unequal siblings", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -5058024.97889961861074, -338775.327889009960927 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Utopia Planitia", "Orbit": 22150, "PR_Date": "2022-03-30", "Release_Nr": "981-987", "Year": 2022, "lat_1": 43.188176521899997, "lon_1": 83.521995093499996, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_Utopia-_Planitia_frozen_beauty/index.html", "FN_3D": "984-20220309-22150-3d-1-UtopiaPlanitia.tif", "FN_CO": "983-20220309-22150-co-UtopiaPlanitia.tif", "FN_3D2": null, "FN_AN": "987-20220309-22150-an-UtopiaPlanitia.tif", "FN_HT": "982-20220309-22150-ht-UtopiaPlanitia.tif", "FN_TXT": null, "FN_CTX": "981-20220309-22150-ctxt-UtopiaPlanitia.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Utopia Planitia – the frozen beauty", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4950740.99570937268436, 2559966.099919494241476 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Aonia Terra", "Orbit": 23137, "PR_Date": "2022-06-08", "Release_Nr": "994-999", "Year": 2022, "lat_1": -48.553721106099999, "lon_1": -77.506707213300004, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_Aonia_Terra_Colorful_Mars/index.html", "FN_3D": "997-20220516-23137-3d-1-AoniaTerra.tif", "FN_CO": "996-20220516-23137-co-AoniaTerra.tif", "FN_3D2": null, "FN_AN": "999-20220516-23137-an-AoniaTerra.tif", "FN_HT": "995-20220516-23137-ht-AoniaTerra.tif", "FN_TXT": null, "FN_CTX": "994-20220516-23137-ctxt-AoniaTerra.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Aonia Terra – colorful Mars", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -4594186.626098535954952, -2878007.132197050843388 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Tantalus Fossae", "Orbit": 22173, "PR_Date": "2022-04-28", "Release_Nr": "988-993", "Year": 2022, "lat_1": 42.901229263499999, "lon_1": -102.933655531, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_TantalusFossae_tantalizing_tectonics/index.html", "FN_3D": "991-20220412-22173-3d-1-TantalusFossae.tif", "FN_CO": "990-20220412-22173-co-TantalusFossae.tif", "FN_3D2": null, "FN_AN": "993-20220412-22173-an-TantalusFossae.tif", "FN_HT": "989-20220412-22173-ht-TantalusFossae.tif", "FN_TXT": null, "FN_CTX": "988-20220412-22173-ctxt-TantalusFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Tantalus Fossae – tantaliting tectonics", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6101361.296543605625629, 2542957.38797292066738 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Jovis Tholus", "Orbit": 0, "PR_Date": "2022-01-26", "Release_Nr": "971-974", "Year": 2022, "lat_1": 18.243061923300001, "lon_1": -117.472415113, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_Jovis-Tholus-Volcano/index.html", "FN_3D": "972-20210927-mosaic-3d-1-JovisTholus.tif", "FN_CO": "973-20210927-mosaic-co-JovisTholus.tif", "FN_3D2": null, "FN_AN": null, "FN_HT": "974-20210927-mosaic-ht-Jovis Tholus.tif", "FN_TXT": null, "FN_CTX": "971-20210927-mosaic-ctxt-JovisTholus.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "Jovis Tholus volcano – sunken in a lava sea", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -6963141.873135330155492, 1081351.977402196731418 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Medusae Fossae", "Orbit": 21948, "PR_Date": "2022-02-23", "Release_Nr": "975-980", "Year": 2022, "lat_1": 1.6089303046700001, "lon_1": -162.210565124, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2022_Medusae-Fossae--wind/index.html", "FN_3D": "978-20220123-21948-3d-1-MedusaeFossae.tif", "FN_CO": "977-20220123-21948-co-MedusaeFossae.tif", "FN_3D2": null, "FN_AN": "980-20220123-21948-an-MedusaeFossae.tif", "FN_HT": "976-20220123-21948-ht-MedusaeFossae.tif", "FN_TXT": null, "FN_CTX": "975-20220123-21948-ctxt-MedusaeFossae.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The Medusae Fossae formation at Eumenides dorsum – wind at work", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ -9614982.182828122749925, 95368.857145504603977 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "Hour Glass Animation", "Orbit": 451, "PR_Date": "2006-03-17", "Release_Nr": "242-245", "Year": 2006, "lat_1": -38.6561387677, "lon_1": 102.705432707, "lon_1_pos": 0.0, "Movie": "x", "URL_PR": "http://www.planet.geo.fu-berlin.de/eng/projects/mars/hrsc242-HourGlassMovies.php", "FN_3D": "242-20050317-0451-3d-1-HourGlass.tif", "FN_CO": null, "FN_3D2": null, "FN_AN": null, "FN_HT": null, "FN_TXT": null, "FN_CTX": "178-20050317-0451-ctxt-Hourglass.tif", "Comment": null, "FN_Video": "244-20060207-0451-mov-HourGlass.mov", "FN_ND": null, "Titel": null, "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 6087833.457704504951835, -2291330.932871529832482 ] } }, \
    { "type": "Feature", "properties": { "Id": 0, "Name": "The Landing of Perseverance", "Orbit": 0, "PR_Date": "2021-02-18", "Release_Nr": "967-969", "Year": 2021, "lat_1": 18.342002317, "lon_1": 77.727439701700007, "lon_1_pos": 0.0, "Movie": null, "URL_PR": "https://www.geo.fu-berlin.de/en/geol/fachrichtungen/planet/presse/2021_preseverance_landing/index.html", "FN_3D": "967-20210211-mosaic-3d-1-LandingPerseverance.tif", "FN_CO": null, "FN_3D2": null, "FN_AN": "967-20210211-mosaic-an-LandingPerseverance.tif", "FN_HT": null, "FN_TXT": null, "FN_CTX": "967-20210211-mosaic-ctxt-LandingPerseverance.tif", "Comment": null, "FN_Video": null, "FN_ND": null, "Titel": "The landing of Perseverance – NASA\'s Mars rover", "subfolder": null }, "geometry": { "type": "Point", "coordinates": [ 4607270.477580773644149, 1087216.63930934574455 ] } }\
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


// PR Targets
/// class Panorama {
///   constructor(feature) {
///     this.id=feature.get('id');
///     this.name=feature.get('name');
///     this.image=feature.get('panorama');
///     //console.dir(this.image);
///     if (feature.get('rotation') === undefined) {
///       feature.set('rotation','0 0 0');
///     }
///     this.rotation=feature.get('rotation');
///     if (feature.get('icon') === undefined) {
///       feature.set('icon','map-marker-alt');
///     }
///     this.icon=feature.get('icon');
///     this.credits=feature.get('credits');
///     this.infos=[];
///   }
/// }
var addPRTarget=function(feature){
  var id = feature.get('id');
  feature.setId(id);
  feature.setProperties({
    'layer': 'pr_targets_lay'
  });
  panos[id] = new Panorama(feature);
}
/// var currentPano=-1;
/// var panos = [];
/// var ll2xyz = function(coordinates){
///   var xyz = transform(coordinates, projection49901, projection49911);
///   return xyz;
/// }

var pr_targets_source = new VectorSource({
  features: new GeoJSON().readFeatures(pr_featuresAsText)
}); 
//pr_targets_source.forEachFeature(addPano);
pr_targets_source.forEachFeature(addPRTarget);
var pr_styleFeature = new Style({
    text: new Text({
      text: '\uf041',
      font: '900 24px "Font Awesome 5 Free"',
      textBaseline: 'bottom',
      fill: new Fill({
        color: 'white'
      })
    })
  });

var pr_targets_lay = new Vector({
  title: "PR Targets",
  source: pr_targets_source,
  style: pr_styleFeature,
  //minZoom: 8
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
  type: 'sortpanel',
  sortable: true,
  title: 'Orthorectified images',
  layers: [
    lay04,
    lay05,
    lay06
  ]
})

var lyrgrp03 = new LayerGroup({
  title: 'Two groups',
  layers: [
    lyrgrp01,
    lyrgrp02
  ]
})

var lyrgrp04 = new LayerGroup({
  fold: "close",
  title: 'Main group',
  // The option 'combine' combines all child layers and layergroups into a single layer which 
  // can either be switched on or off in the menu.
  //combine: true, 
    layers: [
    lyrgrp03
  ]
})


//Dynamic layer group
var dynlyrgrp = new LayerGroup({
  fold: "close",
  title: 'Dynamic layer group'
})



// Activate sort panel for LayerSwitcher:
LayerSwitcher.sortPanelActive=true;

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




/* HRSC ND4a Footprints WFS*/
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

var startTime=new Date('2009-01-01T00:00:00.000Z');
var stopTime=new Date('2013-01-01T00:00:00.000Z');

var updateTimesonWmsLayers = function() {
//	hrsc4aNdWms.getSource().setUrl('https://maps.planet.fu-berlin.de/eqc-bin/wms?'+'TIME=' + app.startTime.toISOString() + '/' + app.stopTime.toISOString() + '&');
	hrsc4aNdWfs.getSource().setUrl('https://maps.planet.fu-berlin.de/eqc-bin/wms?'+'TIME=' + startTime.toISOString() + '/' + stopTime.toISOString() + '&');
};



var initHrsc4a = function(){
	allHrsc4aNdWfs.getSource().clear();
    var queryLayer='';
    var featureRequest = new WFS().writeGetFeature({
//        featureNS: 'https://'+app.ogchost+app.cgi,
//        featureNS: 'https://maps.planet.fu-berlin.de/eqc-bin/wfs?',
        featureNS: 'https://maps.planet.fu-berlin.de/eqc-bin/wms?',
        featureTypes: ['hrsc4and'],
        outputFormat: 'geojson',
//        srsName: app.currentProjection.getCode(),
        srsName: 'EPSG:49910',
        maxFeatures: 10000,
        //filter: andFilter(
        //  likeFilter('name', 'Mississippi*'),
        //  equalToFilter('waterway', 'riverbank')
        //),
        //filter: //andFilter(
        //  equalToFilter('map_scale', '50.0000')
        ////),
        //,
        filter: andFilter(
          // The filter seems to work also for timestamps without the letters 'T' and 'Z' in the string:
//          lessThanOrEqualToFilter('stop_time', '2005-01-01 00:00:00.000'),
//          greaterThanOrEqualToFilter('start_time', '1996-01-01 00:00:00.000'),
          lessThanOrEqualToFilter('stop_time', '2005-01-01T00:00:00.000Z'),
          greaterThanOrEqualToFilter('start_time', '1996-01-01T00:00:00.000Z'),
        ),
    });
//    fetch('https://'+app.ogchost+app.cgi, {
//    fetch('https://maps.planet.fu-berlin.de/eqc-bin/wfs?', {
    fetch('https://maps.planet.fu-berlin.de/eqc-bin/wms?', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(function(response) {
          return response.json();
      }).then(function(json) {
        var features = new GeoJSON().readFeatures(json);
        allHrsc4aNdWfs.getSource().addFeatures(features);
        console.dir(features.length + ' HRSC4a sequences retrieved.');
        //
        //updateTimesonWmsLayers();

        refreshLevel4a();
      }).catch(function(err) {
          console.dir(err);
    });
}
initHrsc4a();
var refreshLevel4a = function() {
	hrsc4aNdWfs.getSource().clear();
	var inciMin=0;
        allHrsc4aNdWfs.getSource().forEachFeature(function(feature){
    	var scale=feature.getProperties().map_scale;
    	var ls=feature.getProperties().ls;
//    	var starttime=new Date(feature.getProperties().start_time+'Z');
//    	var stoptime=new Date(feature.getProperties().stop_time+'Z');
      var starttime=new Date('2009-01-01T00:00:00.000Z');
    	var stoptime=new Date('2013-01-01T00:00:00.000Z');


    	if (parseFloat(feature.getProperties().stopinci)>parseFloat(feature.getProperties().startinci)) {
    		var inci=[parseFloat(feature.getProperties().startinci),parseFloat(feature.getProperties().stopinci)];
    	} else {
    		var inci=[parseFloat(feature.getProperties().stopinci),parseFloat(feature.getProperties().startinci)];
    	}
    	var minltst=new Date('1970-01-01T'+feature.getProperties().minltst+'Z');
    	var maxltst=new Date('1970-01-01T'+feature.getProperties().maxltst+'Z');
    	if ((app.selMaxRes != app.maxRes) && (scale > app.selMaxRes)) {
			return null;
    	}
    	if ((app.selMinRes != app.minRes) && (scale < app.selMinRes)) {
			return null;
    	}
    	if ((app.selMaxLs != app.maxLs) && (ls > app.selMaxLs)) {
			return null;
    	}
    	if ((app.selMinLs != app.minLs) && (ls < app.selMinLs)) {
			return null;
    	}
    	if ((stoptime < app.startTime ) || (starttime > app.stopTime)) {
    		return null;
    	}
    	if ((maxltst < app.startLocalTime ) || (minltst > app.stopLocalTime)) {
    		return null;
    	}
    	if ((inci[1] < app.inci[0] ) || ( inci[0] > app.inci[1] && app.inci[1] != app.timePanel.inciSlider.getAttribute('max') ) ) {
    		return null;
    	}
    	if (inci[0]>inciMin) {
    		inciMin=inci[0];
    	}
    	hrsc4aNdWfs.getSource().addFeature(feature);
    });
    console.dir(hrsc4aNdWfs.getSource().getFeatures().length + ' HRSC4a sequences loaded.');
}

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
        params: { LAYERS: "HRSC-single-dtms" }
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


    hrsc4aNdWfs,
    allHrsc4aNdWfs,


    //lyrgrp01,
    //lyrgrp02,

    //lyrgrp03,
    lyrgrp04,


    dynlyrgrp,

    pr_targets_lay,


    
//    new TileLayer ({
//      title: "MEx HRSC ND3",
//      source: new TileWMS({
//        url: "https://maps.planet.fu-berlin.de/eqc-bin/wms?",
//        params: { 
//          LAYERS: "hrsc4nd", 
//          TIME: "2018-06-01T16:38:38.000Z/2022-06-30T00:48:51.000Z" 
//        },
//      })
//    }),

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


// Source: Example - OL - Select Features by Hover
// https://openlayers.org/en/latest/examples/select-hover-features.html
const selectStyle = new Style({
  fill: new Fill({
    color: '#eeeeee',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2,
  }),
});

const status = document.getElementById('status');

let selected = null;
let wfsProductid = null;
let wfsFilename = null;
let wfsTarget = null;

map.on('click', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }

  map.forEachFeatureAtPixel(e.pixel, function (f) {
    selected = f;
    selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
    f.setStyle(selectStyle);
    return true;
  });

  if (selected) {
    wfsFilename = selected.get('file_name');
    wfsProductid = selected.get('source_product_id');
    wfsTarget = selected.get('target');

    //status.innerHTML = selected.get('ECO_NAME');
    //status.innerHTML = selected.get('source_product_id');
    status.innerHTML = wfsProductid;
    //status.innerHTML = "selected.get('filename')";
    
    

    var tmpTile = new TileLayer({
      title: wfsProductid,
      opacity: 1,
      visible: true,
      //source: source
      source: new TileWMS({
        url: "https://maps.planet.fu-berlin.de/eqc/wms?",
        params: { 
          //LAYERS: "HMChsvlog"
          //LAYERS: selected.get('source_product_id')
          LAYERS: "hrsc4",
          VERSION: '1.3.0',
          TILED: true,
          //PRODUCTID: wfsFilename,
          PRODUCTID: wfsProductid,
        }
      })
    });
    //TODO: Check if layer with this name already exists and just update its content, not add a new one
    //if (dynlyrgrp.getLayers().title != )
    dynlyrgrp.getLayers().insertAt(0,tmpTile);
    //dynlyrgrp.push(tmpTile);
    LayerSwitcher.renderPanel(map, toc, { reverse: true });


  } else {
    status.innerHTML = '&nbsp;';
  }
});






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
      //PR Targets
      else if (feature.get('layer') == 'pr_targets_lay') {
      //console.dir(feature.get('layer'));
      feature.setStyle();
      feature.setStyle(styleFeatureBig);
      currentFeature=feature;
      var text = feature.get('Year');
      tooltip.style.display = 'none';
      tooltip.innerHTML = text;
      tooltip.style.display = 'block';
      mapdiv.style.cursor = "pointer";
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