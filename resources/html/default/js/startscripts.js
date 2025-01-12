var namespaces={"rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","xsd":"http://www.w3.org/2001/XMLSchema#","geo":"http://www.opengis.net/ont/geosparql#","rdfs":"http://www.w3.org/2000/01/rdf-schema#","owl":"http://www.w3.org/2002/07/owl#","dc":"http://purl.org/dc/terms/","skos":"http://www.w3.org/2004/02/skos/core#"}
var annotationnamespaces=["http://www.w3.org/2004/02/skos/core#","http://www.w3.org/2000/01/rdf-schema#","http://purl.org/dc/terms/"]
var indexpage=false
var geoproperties={
   "http://www.opengis.net/ont/geosparql#asWKT":"DatatypeProperty",
   "http://www.opengis.net/ont/geosparql#asGML": "DatatypeProperty",
   "http://www.opengis.net/ont/geosparql#asKML": "DatatypeProperty",
   "http://www.opengis.net/ont/geosparql#asGeoJSON": "DatatypeProperty",
   "http://www.opengis.net/ont/geosparql#hasGeometry": "ObjectProperty",
   "http://www.opengis.net/ont/geosparql#hasDefaultGeometry": "ObjectProperty",
   "http://www.w3.org/2003/01/geo/wgs84_pos#geometry": "ObjectProperty",
   "http://www.georss.org/georss/point": "DatatypeProperty",
   "http://www.w3.org/2006/vcard/ns#hasGeo": "ObjectProperty",
   "http://www.w3.org/2003/01/geo/wgs84_pos#lat":"DatatypeProperty",
   "http://www.w3.org/2003/01/geo/wgs84_pos#long": "DatatypeProperty",
   "http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#hasLatitude": "DatatypeProperty",
   "http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#hasLongitude": "DatatypeProperty",
   "http://schema.org/geo": "ObjectProperty",
   "http://schema.org/polygon": "DatatypeProperty",
   "https://schema.org/geo": "ObjectProperty",
   "https://schema.org/polygon": "DatatypeProperty",
   "http://geovocab.org/geometry#geometry": "ObjectProperty",
   "http://www.w3.org/ns/locn#geometry": "ObjectProperty",
   "http://rdfs.co/juso/geometry": "ObjectProperty",
   "http://www.wikidata.org/prop/direct/P625":"DatatypeProperty",
   "https://database.factgrid.de/prop/direct/P48": "DatatypeProperty",
   "http://database.factgrid.de/prop/direct/P48":"DatatypeProperty",
   "http://www.wikidata.org/prop/direct/P3896": "DatatypeProperty"
}

commentproperties={
    "http://www.w3.org/2004/02/skos/core#definition":"DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#note": "DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#scopeNote": "DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#historyNote": "DatatypeProperty",
    "https://schema.org/description":"DatatypeProperty",
    "http://www.w3.org/2000/01/rdf-schema#comment": "DatatypeProperty",
    "http://purl.org/dc/terms/description": "DatatypeProperty",
    "http://purl.org/dc/elements/1.1/description": "DatatypeProperty"
}

labelproperties={
    "http://www.w3.org/2004/02/skos/core#prefLabel":"DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#prefSymbol": "DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#altLabel": "DatatypeProperty",
    "https://schema.org/name": "DatatypeProperty",
    "https://schema.org/alternateName": "DatatypeProperty",
    "http://purl.org/dc/terms/title": "DatatypeProperty",
    "http://purl.org/dc/elements/1.1/title":"DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#altSymbol": "DatatypeProperty",
    "http://www.w3.org/2004/02/skos/core#hiddenLabel": "DatatypeProperty",
    "http://www.w3.org/2000/01/rdf-schema#label": "DatatypeProperty"
}

var baseurl="{{baseurl}}"
  $( function() {
    var availableTags = Object.keys(search)
    $( "#search" ).autocomplete({
      source: availableTags
    });
    console.log(availableTags)
    setupJSTree()
  } );

function openNav() {
  document.getElementById("mySidenav").style.width = "400px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

function exportGeoJSON(){
    if(typeof(feature) !== "undefined"){
        saveTextAsFile(JSON.stringify(feature),"geojson")
    }
}

function parseWKTStringToJSON(wktstring){
    wktstring=wktstring.substring(wktstring.lastIndexOf('(')+1,wktstring.lastIndexOf(')')-1)
    resjson=[]
    for(coordset of wktstring.split(",")){
        curobject={}
        coords=coordset.trim().split(" ")
        console.log(coordset)
        console.log(coords)
        if(coords.length==3){
            resjson.push({"x":parseFloat(coords[0]),"y":parseFloat(coords[1]),"z":parseFloat(coords[2])})
        }else{
            resjson.push({"x":parseFloat(coords[0]),"y":parseFloat(coords[1])})
        }
    }
    console.log(resjson)
    return resjson
}

function exportCSV(){
    rescsv=""
    if(typeof(feature)!=="undefined"){
        if("features" in feature){
           for(feat of feature["features"]){
                rescsv+="\""+feat["geometry"]["type"].toUpperCase()+"("
                feat["geometry"].coordinates.forEach(function(p,i){
                //	console.log(p)
                    if(i<feat["geometry"].coordinates.length-1)rescsv =  rescsv + p[0] + ' ' + p[1] + ', ';
                    else rescsv =  rescsv + p[0] + ' ' + p[1] + ')';
                })
                rescsv+=")\","
                if("properties" in feat){
                    if(gottitle==false){
                       rescsvtitle="\"the_geom\","
                       for(prop in feat["properties"]){
                          rescsvtitle+="\""+prop+"\","
                       }
                       rescsvtitle+="\\n"
                       rescsv=rescsvtitle+rescsv
                       gottitle=true
                    }
                    for(prop in feat["properties"]){
                        rescsv+="\""+feat["properties"][prop]+"\","
                    }
                }
                rescsv+="\\n"
           }
        }else{
            gottitle=false
            rescsv+="\""+feature["geometry"]["type"].toUpperCase()+"("
            feature["geometry"].coordinates.forEach(function(p,i){
            //	console.log(p)
                if(i<feature["geometry"].coordinates.length-1)rescsv =  rescsv + p[0] + ' ' + p[1] + ', ';
                else rescsv =  rescsv + p[0] + ' ' + p[1] + ')';
            })
            rescsv+=")\","
            if("properties" in feature){
                if(gottitle==false){
                   rescsvtitle=""
                   for(prop in feature["properties"]){
                      rescsvtitle+="\""+prop+"\","
                   }
                   rescsvtitle+="\\n"
                   rescsv=rescsvtitle+rescsv
                   gottitle=true
                }
                for(prop in feature["properties"]){
                    rescsv+="\""+feature["properties"][prop]+"\","
                }
            }
        }
        saveTextAsFile(rescsv,".csv")
    }else if(typeof(nongeofeature)!=="undefined"){
        if("features" in nongeofeature){
           for(feat of nongeofeature["features"]){
                if("properties" in feat){
                    if(gottitle==false){
                       rescsvtitle="\"the_geom\","
                       for(prop in feat["properties"]){
                          rescsvtitle+="\""+prop+"\","
                       }
                       rescsvtitle+="\\n"
                       rescsv=rescsvtitle+rescsv
                       gottitle=true
                    }
                    for(prop in feat["properties"]){
                        rescsv+="\""+feat["properties"][prop]+"\","
                    }
                }
                rescsv+="\\n"
           }
        }else{
            gottitle=false
            if("properties" in nongeofeature){
                if(gottitle==false){
                   rescsvtitle=""
                   for(prop in nongeofeature["properties"]){
                      rescsvtitle+="\""+prop+"\","
                   }
                   rescsvtitle+="\\n"
                   rescsv=rescsvtitle+rescsv
                   gottitle=true
                }
                for(prop in nongeofeature["properties"]){
                    rescsv+="\""+nongeofeature["properties"][prop]+"\","
                }
            }
        }
        saveTextAsFile(rescsv,".csv")
    }
}

function setSVGDimensions(){
    $('svg').each(function(i, obj) {
        console.log(obj)
        console.log($(obj).children().first()[0])
        if($(obj).attr("viewBox") || $(obj).attr("width") || $(obj).attr("height")){
            return
        }
        maxx=Number.MIN_VALUE
        maxy=Number.MIN_VALUE
        minx=Number.MAX_VALUE
        miny=Number.MAX_VALUE
        $(obj).children().each(function(i){
            svgbbox=$(this)[0].getBBox()
            console.log(svgbbox)
            if(svgbbox.x+svgbbox.width>maxx){
                maxx=svgbbox.x+svgbbox.width
            }
            if(svgbbox.y+svgbbox.height>maxy){
                maxy=svgbbox.y+svgbbox.height
            }
            if(svgbbox.y<miny){
                miny=svgbbox.y
            }
            if(svgbbox.x<minx){
                minx=svgbbox.x
            }
        });
        console.log(""+(minx)+" "+(miny-(maxy-miny))+" "+((maxx-minx)+25)+" "+((maxy-miny)+25))
        newviewport=""+((minx))+" "+(miny)+" "+((maxx-minx)+25)+" "+((maxy-miny)+25)
        $(obj).attr("viewBox",newviewport)
        $(obj).attr("width",((maxx-minx))+10)
        $(obj).attr("height",((maxy-miny)+10))
        console.log($(obj).hasClass("svgoverlay"))
        if($(obj).hasClass("svgoverlay")){
            naturalWidth=$(obj).prev().children('img')[0].naturalWidth
            naturalHeight=$(obj).prev().children('img')[0].naturalHeight
            currentWidth=$(obj).prev().children('img')[0].width
            currentHeight=$(obj).prev().children('img')[0].height
            console.log(naturalWidth+" - "+naturalHeight+" - "+currentWidth+" - "+currentHeight)
            overlayposX = (currentWidth/naturalWidth) * minx;
            overlayposY = (currentHeight/naturalHeight) * miny;
            overlayposWidth = ((currentWidth/naturalWidth) * maxx)-overlayposX;
            overlayposHeight = ((currentHeight/naturalHeight) * maxy)-overlayposY;
            console.log(overlayposX+" - "+overlayposY+" - "+overlayposHeight+" - "+overlayposWidth)
            $(obj).css({top: overlayposY+"px", left:overlayposX+"px", position:"absolute"})
            $(obj).attr("height",overlayposHeight)
            $(obj).attr("width",overlayposWidth)
        }
    });
}



function exportWKT(){
    if(typeof(feature)!=="undefined"){
        reswkt=""
        if("features" in feature){
            for(feat of feature["features"]){
                reswkt+=feat["geometry"]["type"].toUpperCase()+"("
                feat["geometry"].coordinates.forEach(function(p,i){
                //	console.log(p)
                    if(i<feat["geometry"].coordinates.length-1)reswkt =  reswkt + p[0] + ' ' + p[1] + ', ';
                    else reswkt =  reswkt + p[0] + ' ' + p[1] + ')';
                })
                reswkt+=")\\n"
            }
        }else{
                reswkt+=feature["geometry"]["type"].toUpperCase()+"("
                feature["geometry"].coordinates.forEach(function(p,i){
                    if(i<feature["geometry"].coordinates.length-1)reswkt =  reswkt + p[0] + ' ' + p[1] + ', ';
                    else reswkt =  reswkt + p[0] + ' ' + p[1] + ')';
                })
                reswkt+=")\\n"
        }
        saveTextAsFile(reswkt,".wkt")
    }
}

function downloadFile(filePath){
    var link=document.createElement('a');
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
    link.click();
}

function saveTextAsFile(tosave,fileext){
    var a = document.createElement('a');
    a.style = "display: none";
    var blob= new Blob([tosave], {type:'text/plain'});
    var url = window.URL.createObjectURL(blob);
    var filename = "res."+fileext;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 1000);
}

function download(){
    format=$('#format').val()
    if(format=="geojson"){
        exportGeoJSON()
    }else if(format=="ttl"){
        downloadFile("index.ttl")
    }else if(format=="json"){
        downloadFile("index.json")
    }else if(format=="wkt"){
        exportWKT()
    }else if(format=="csv"){
        exportCSV()
    }
}

function rewriteLink(thelink){
    if(thelink==null){
        rest=search[document.getElementById('search').value].replace(baseurl,"")
    }else{
        curlocpath=window.location.href.replace(baseurl,"")
        rest=thelink.replace(baseurl,"")
    }
    if(!(rest.endsWith("/"))){
        rest+="/"
    }
    count=0
    if(!indexpage){
        count=rest.split("/").length-1
    }
    console.log(count)
    counter=0
    if (typeof relativedepth !== 'undefined'){
        while(counter<relativedepth){
            rest="../"+rest
            counter+=1
        }
    }else{
        while(counter<count){
            rest="../"+rest
            counter+=1
        }
    }
    //console.log(rest)
    //console.log(rest.endsWith("index.html"))
    rest+="index.html"
    console.log(rest)
    return rest
}

function followLink(thelink=null){
    rest=rewriteLink(thelink)
    location.href=rest
}

function changeDefLink(){
	$('#formatlink').attr('href',definitionlinks[$('#format').val()]);
}

function changeDefLink2(){
	$('#formatlink2').attr('href',definitionlinks[$('#format2').val()]);
}

var definitionlinks={
    "covjson":"https://covjson.org",
    "csv":"https://tools.ietf.org/html/rfc4180",
    "cipher":"https://neo4j.com/docs/cypher-manual/current/",
    "esrijson":"https://doc.arcgis.com/de/iot/ingest/esrijson.htm",
    "geohash":"http://geohash.org",
    "json":"https://geojson.org",
    "gdf":"https://www.cs.nmsu.edu/~joemsong/software/ChiNet/GDF.pdf",
    "geojsonld":"http://geojson.org/geojson-ld/",
    "geojsonseq":"https://tools.ietf.org/html/rfc8142",
    "geouri":"https://tools.ietf.org/html/rfc5870",
    "gexf":"https://gephi.org/gexf/format/",
    "gml":"https://www.ogc.org/standards/gml",
    "gml2":"https://gephi.org/users/supported-graph-formats/gml-format/",
    "gpx":"https://www.topografix.com/gpx.asp",
    "graphml":"http://graphml.graphdrawing.org",
    "gxl":"http://www.gupro.de/GXL/Introduction/intro.html",
    "hdt":"https://www.w3.org/Submission/2011/03/",
    "hextuples":"https://github.com/ontola/hextuples",
    "html":"https://html.spec.whatwg.org",
    "jsonld":"https://json-ld.org",
    "jsonn":"",
    "jsonp":"http://jsonp.eu",
    "jsonseq":"https://tools.ietf.org/html/rfc7464",
    "kml":"https://www.ogc.org/standards/kml",
    "latlon":"",
    "mapml":"https://maps4html.org/MapML/spec/",
    "mvt":"https://docs.mapbox.com/vector-tiles/reference/",
    "n3":"https://www.w3.org/TeamSubmission/n3/",
    "nq":"https://www.w3.org/TR/n-quads/",
    "nt":"https://www.w3.org/TR/n-triples/",
    "olc":"https://github.com/google/open-location-code/blob/master/docs/specification.md",
    "osm":"https://wiki.openstreetmap.org/wiki/OSM_XML",
    "osmlink":"",
    "rdfxml":"https://www.w3.org/TR/rdf-syntax-grammar/",
    "rdfjson":"https://www.w3.org/TR/rdf-json/",
    "rt":"https://afs.github.io/rdf-thrift/rdf-binary-thrift.html",
    "svg":"https://www.w3.org/TR/SVG11/",
    "tgf":"https://docs.yworks.com/yfiles/doc/developers-guide/tgf.html",
    "tlp":"https://tulip.labri.fr/TulipDrupal/?q=tlp-file-format",
    "trig":"https://www.w3.org/TR/trig/",
    "trix":"https://www.hpl.hp.com/techreports/2004/HPL-2004-56.html",
    "ttl":"https://www.w3.org/TR/turtle/",
    "wkb":"https://www.iso.org/standard/40114.html",
    "wkt":"https://www.iso.org/standard/40114.html",
    "xls":"http://www.openoffice.org/sc/excelfileformat.pdf",
    "xlsx":"http://www.openoffice.org/sc/excelfileformat.pdf",
    "xyz":"https://gdal.org/drivers/raster/xyz.html",
    "yaml":"https://yaml.org"
    }

function shortenURI(uri){
	prefix=""
	if(typeof(uri)!="undefined"){
		for(namespace in namespaces){
			if(uri.includes(namespaces[namespace])){
				prefix=namespace+":"
				break
			}
		}
	}
	if(typeof(uri)!= "undefined" && uri.includes("#")){
		return prefix+uri.substring(uri.lastIndexOf('#')+1)
	}
	if(typeof(uri)!= "undefined" && uri.includes("/")){
		return prefix+uri.substring(uri.lastIndexOf("/")+1)
	}
	return uri
}

var presenter = null;
function setup3dhop(meshurl,meshformat) {
  presenter = new Presenter("draw-canvas");
  presenter.setScene({
    meshes: {
			"mesh_1" : { url: meshurl}
		},
		modelInstances : {
			"model_1" : {
				mesh  : "mesh_1",
				color : [0.8, 0.7, 0.75]
			}
		}
  });
}

function start3dhop(meshurl,meshformat){
    init3dhop();
	setup3dhop(meshurl,meshformat);
	resizeCanvas(640,480);
  	moveToolbar(20,20);
}


let camera, scene, renderer,controls;

function viewGeometry(geometry) {
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    vertexColors: THREE.VertexColors,
    wireframe: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function initThreeJS(domelement,verts,meshurls) {
    scene = new THREE.Scene();
    minz=Number.MAX_VALUE
    maxz=Number.MIN_VALUE
    miny=Number.MAX_VALUE
    maxy=Number.MIN_VALUE
    minx=Number.MAX_VALUE
    maxx=Number.MIN_VALUE
	vertarray=[]
    console.log(verts)
    var svgShape = new THREE.Shape();
    first=true
    for(vert of verts){
        if(first){
            svgShape.moveTo(vert["x"], vert["y"]);
           first=false
        }else{
            svgShape.lineTo(vert["x"], vert["y"]);
        }
        vertarray.push(vert["x"])
        vertarray.push(vert["y"])
        vertarray.push(vert["z"])
        if(vert["z"]>maxz){
            maxz=vert["z"]
        }
        if(vert["z"]<minz){
            minz=vert["z"]
        }
        if(vert["y"]>maxy){
            maxy=vert["y"]
        }
        if(vert["y"]<miny){
            miny=vert["y"]
        }
        if(vert["x"]>maxx){
            maxy=vert["x"]
        }
        if(vert["x"]<minx){
            miny=vert["x"]
        }
    }
    if(meshurls.length>0){
        var loader = new THREE.PLYLoader();
        loader.load(meshurls[0], viewGeometry);
    }
    camera = new THREE.PerspectiveCamera(90,window.innerWidth / window.innerHeight, 0.1, 150 );
    scene.add(new THREE.AmbientLight(0x222222));
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 20, 0);
    scene.add(light);
    var axesHelper = new THREE.AxesHelper( Math.max(maxx, maxy, maxz)*4 );
    scene.add( axesHelper );
    console.log("Depth: "+(maxz-minz))
    var extrudedGeometry = new THREE.ExtrudeGeometry(svgShape, {depth: maxz-minz, bevelEnabled: false});
    extrudedGeometry.computeBoundingBox()
    centervec=new THREE.Vector3()
    extrudedGeometry.boundingBox.getCenter(centervec)
    console.log(centervec)
    const material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, wireframe:true } );
    const mesh = new THREE.Mesh( extrudedGeometry, material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( 480, 500 );
    document.getElementById(domelement).appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set( centervec.x,centervec.y,centervec.z );
    camera.position.x= centervec.x
    camera.position.y= centervec.y
    camera.position.z = centervec.z+10;
    controls.maxDistance= Math.max(maxx, maxy, maxz)*5
    controls.update();
    animate()
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

function getTextAnnoContext(){
$('span.textanno').each(function(i, obj) {
    startindex=$(obj).attr("start").val()
    endindex=$(obj).attr("end").val()
    exact=$(obj).attr("exact").val()
    if($(obj).attr("src")){
        source=$(obj).attr("src").val()
        $.get( source, function( data ) {
            markarea=data.substring(start,end)
            counter=0
            startindex=0
            endindex=data.indexOf("\\n",end)
            for(line in data.split("\\n")){
                counter+=line.length
                if(counter>start){
                    startindex=counter-line.length
                    break
                }
            }
            $(obj).html(data.substring(startindex,endindex)+"</span>".replace(markarea,"<mark>"+markarea+"</mark>"))
        });
    }
  });
}

function labelFromURI(uri,label){
    if(uri.includes("#")){
        prefix=uri.substring(0,uri.lastIndexOf('#')-1)
        if(label!=null){
            return label+" ("+prefix.substring(prefix.lastIndexOf("/")+1)+":"+uri.substring(uri.lastIndexOf('#')+1)+")"

        }else{
            return uri.substring(uri.lastIndexOf('#')+1)+" ("+prefix.substring(uri.lastIndexOf("/")+1)+":"+uri.substring(uri.lastIndexOf('#')+1)+")"
        }
    }
    if(uri.includes("/")){
        prefix=uri.substring(0,uri.lastIndexOf('/')-1)
        if(label!=null){
            return label+" ("+prefix.substring(prefix.lastIndexOf("/")+1)+":"+uri.substring(uri.lastIndexOf('/')+1)+")"
        }else{
            return uri.substring(uri.lastIndexOf('/')+1)+" ("+prefix.substring(uri.lastIndexOf("/")+1)+":"+uri.substring(uri.lastIndexOf('/')+1)+")"
        }
    }
    return uri
}

function formatHTMLTableForPropertyRelations(propuri,result,propicon){
    dialogcontent="<h3><img src=\""+propicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+propuri.replace('/index.json','/index.html')+"\" target=\"_blank\"> "+shortenURI(propuri)+"</a></h3><table border=1 id=classrelationstable><thead><tr><th>Incoming Concept</th><th>Relation</th><th>Outgoing Concept</th></tr></thead><tbody>"
    console.log(result)
    for(instance in result["from"]){
//
            if(result["from"][instance]=="instancecount"){
                continue;
            }
            dialogcontent+="<tr><td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/class.png\" height=\"25\" width=\"25\" alt=\"Class\"/><a href=\""+result["from"][instance]+"\" target=\"_blank\">"+shortenURI(result["from"][instance])+"</a></td>"
            dialogcontent+="<td><img src=\""+propicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+propuri+"\" target=\"_blank\">"+shortenURI(propuri)+"</a></td><td></td></tr>"
       // }
    }
    for(instance in result["to"]){
        //for(instance in result["to"][res]){
            if(result["to"][instance]=="instancecount"){
                continue;
            }
            dialogcontent+="<tr><td></td><td><img src=\""+propicon+"\" height=\"25\" width=\"25\" alt=\"Class\"/><a href=\""+propuri+"\" target=\"_blank\">"+shortenURI(propuri)+"</a></td>"
            dialogcontent+="<td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/class.png\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+result["to"][instance]+"\" target=\"_blank\">"+shortenURI(result["to"][instance])+"</a></td></tr>"
       // }
    }
    dialogcontent+="</tbody></table>"
    dialogcontent+="<button style=\"float:right\" id=\"closebutton\" onclick='document.getElementById(\"classrelationdialog\").close()'>Close</button>"
    return dialogcontent
}

function determineTableCellLogo(uri){
    result="<td><a href=\""+uri+"\" target=\"_blank\">"
    logourl=""
    finished=false
    if(uri in labelproperties){
        result+="<img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/labelproperty.png\" height=\"25\" width=\"25\" alt=\"Label Property\"/>"
        logourl="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/labelproperty.png"
        finished=true
    }
    if(!finished){
        for(ns in annotationnamespaces){
            if(uri.includes(annotationnamespaces[ns])){
                result+="<img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/annotationproperty.png\" height=\"25\" width=\"25\" alt=\"Annotation Property\"/>"
                logourl="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/annotationproperty.png"
                finished=true
            }
        }
    }
    if(!finished && uri in geoproperties && geoproperties[uri]=="ObjectProperty"){
        result+="<img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geoobjectproperty.png\" height=\"25\" width=\"25\" alt=\"Geo Object Property\"/>"
        logourl="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geoobjectproperty.png"
    }else if(!finished && uri in geoproperties && geoproperties[uri]=="DatatypeProperty"){
        result+="<img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geodatatypeproperty.png\" height=\"25\" width=\"25\" alt=\"Geo Datatype Property\"/>"
        logourl="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geodatatypeproperty.png"
    }else if(!finished){
        result+="<img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/objectproperty.png\" height=\"25\" width=\"25\" alt=\"Object Property\"/>"
        logourl="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/objectproperty.png"
    }
    result+=shortenURI(uri)+"</a></td>"
    return [result,logourl]
}

function formatHTMLTableForClassRelations(result,nodeicon,nodelabel,nodeid){
    dialogcontent=""
    if(nodelabel.includes("[")){
        nodelabel=nodelabel.substring(0,nodelabel.lastIndexOf("[")-1)
    }
    dialogcontent="<h3><img src=\""+nodeicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+nodeid.replace('/index.json','/index.html')+"\" target=\"_blank\"> "+nodelabel+"</a></h3><table border=1 id=classrelationstable><thead><tr><th>Incoming Concept</th><th>Incoming Relation</th><th>Concept</th><th>Outgoing Relation</th><th>Outgoing Concept</th></tr></thead><tbody>"
    for(res in result["from"]){
        for(instance in result["from"][res]){
            if(instance=="instancecount"){
                continue;
            }
            dialogcontent+="<tr><td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/class.png\" height=\"25\" width=\"25\" alt=\"Class\"/><a href=\""+instance+"\" target=\"_blank\">"+shortenURI(instance)+"</a></td>"
            dialogcontent+=determineTableCellLogo(res)[0]
            dialogcontent+="<td><img src=\""+nodeicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+nodeid+"\" target=\"_blank\">"+nodelabel+"</a></td><td></td><td></td></tr>"
        }
    }
    for(res in result["to"]){
        for(instance in result["to"][res]){
            if(instance=="instancecount"){
                continue;
            }
            dialogcontent+="<tr><td></td><td></td><td><img src=\""+nodeicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+nodeid+"\" target=\"_blank\">"+nodelabel+"</a></td>"
            dialogcontent+=determineTableCellLogo(res)[0]
            dialogcontent+="<td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/class.png\" height=\"25\" width=\"25\" alt=\"Class\"/><a href=\""+instance+"\" target=\"_blank\">"+shortenURI(instance)+"</a></td></tr>"
        }
    }
    dialogcontent+="</tbody></table>"
    dialogcontent+="<button style=\"float:right\" id=\"closebutton\" onclick='document.getElementById(\"classrelationdialog\").close()'>Close</button>"
    return dialogcontent
}

function formatHTMLTableForResult(result,nodeicon){
    dialogcontent=""
    dialogcontent="<h3><img src=\""+nodeicon+"\" height=\"25\" width=\"25\" alt=\"Instance\"/><a href=\""+nodeid.replace('/index.json','/index.html')+"\" target=\"_blank\"> "+nodelabel+"</a></h3><table border=1 id=dataschematable><thead><tr><th>Type</th><th>Relation</th><th>Value</th></tr></thead><tbody>"
    for(res in result){
        console.log(result)
        console.log(result[res])
        console.log(result[res].size)
        dialogcontent+="<tr>"
        detpropicon=""
        if(res in geoproperties && geoproperties[res]=="ObjectProperty"){
            dialogcontent+="<td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geoobjectproperty.png\" height=\"25\" width=\"25\" alt=\"Geo Object Property\"/>Geo Object Property</td>"
            detpropicon="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/geoobjectproperty.png"
        }else if((result[res][0]+"").startsWith("http")){
            dialogcontent+="<td><img src=\"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/objectproperty.png\" height=\"25\" width=\"25\" alt=\"Object Property\"/>Object Property</td>"
            detpropicon="https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/objectproperty.png"
        }else{
            finished=false
            ress=determineTableCellLogo(res)
            dialogcontent+=ress[0]
            detpropicon=ress[1]
        }
        dialogcontent+="<td><a href=\""+res+"\" target=\"_blank\">"+shortenURI(res)+"</a> <a href=\"#\" onclick=\"getPropRelationDialog('"+res+"','"+detpropicon+"')\">[x]</a></td>"
        if(Object.keys(result[res]).length>1){
            dialogcontent+="<td><ul>"
            for(resitem in result[res]){
                if((resitem+"").startsWith("http")){
                    dialogcontent+="<li><a href=\""+rewriteLink(resitem)+"\" target=\"_blank\">"+shortenURI(resitem)+"</a> ["+result[res][resitem]+"]</li>"
                }else if(resitem!="instancecount"){
                    dialogcontent+="<li>"+resitem+"</li>"
                }
            }
            dialogcontent+="</ul></td>"
        }else if((Object.keys(result[res])[0]+"").startsWith("http")){
            dialogcontent+="<td><a href=\""+rewriteLink(Object.keys(result[res])[0]+"")+"\" target=\"_blank\">"+shortenURI(Object.keys(result[res])[0]+"")+"</a></td>"
        }else if(Object.keys(result[res])[0]!="instancecount"){
            dialogcontent+="<td>"+Object.keys(result[res])[0]+"</td>"
        }else{
            dialogcontent+="<td></td>"
        }
        dialogcontent+="</tr>"
    }
    dialogcontent+="</tbody></table>"
    dialogcontent+="<button style=\"float:right\" id=\"closebutton\" onclick='document.getElementById(\"dataschemadialog\").close()'>Close</button>"
    return dialogcontent
}

function getClassRelationDialog(node){
     nodeid=rewriteLink(normalizeNodeId(node)).replace(".html",".json")
     nodelabel=node.text
     nodetype=node.type
     nodeicon=node.icon
     props={}
     if("data" in node){
        props=node.data
     }
     console.log(nodetype)
     if(nodetype=="class" || nodetype=="geoclass" || nodetype=="collectionclass" || nodetype=="halfgeoclass"){
        console.log(props)
        dialogcontent=formatHTMLTableForClassRelations(props,nodeicon,nodelabel,nodeid)
        document.getElementById("classrelationdialog").innerHTML=dialogcontent
        $('#classrelationstable').DataTable();
        document.getElementById("classrelationdialog").showModal();
     }
}

function getPropRelationDialog(propuri,propicon){
     dialogcontent=formatHTMLTableForPropertyRelations(propuri,proprelations[propuri],propicon)
     console.log(dialogcontent)
     document.getElementById("classrelationdialog").innerHTML=dialogcontent
     $('#classrelationstable').DataTable();
     document.getElementById("classrelationdialog").showModal();
}

function normalizeNodeId(node){
    if(node.id.includes("_suniv")){
        return node.id.replace(/_suniv[0-9]+_/, "")
    }
    return node.id
}

function getDataSchemaDialog(node){
     nodeid=rewriteLink(normalizeNodeId(node)).replace(".html",".json")
     nodelabel=node.text
     nodetype=node.type
     nodeicon=node.icon
     props={}
     if("data" in node){
        props=node.data
     }
     console.log(nodetype)
     if(nodetype=="class" || nodetype=="halfgeoclass" || nodetype=="geoclass" || node.type=="collectionclass"){
        console.log(props)
        dialogcontent=formatHTMLTableForResult(props["to"],nodeicon)
        document.getElementById("dataschemadialog").innerHTML=dialogcontent
        $('#dataschematable').DataTable();
        document.getElementById("dataschemadialog").showModal();
     }else{
         $.getJSON(nodeid, function(result){
            dialogcontent=formatHTMLTableForResult(result,nodeicon)
            document.getElementById("dataschemadialog").innerHTML=dialogcontent
            $('#dataschematable').DataTable();
            document.getElementById("dataschemadialog").showModal();
          });
    }
}

function setupJSTree(){
    console.log("setupJSTree")
    tree["contextmenu"]={}
    tree["core"]["check_callback"]=true
    tree["sort"]=function(a, b) {
        a1 = this.get_node(a);
        b1 = this.get_node(b);
        if (a1.icon == b1.icon){
            return (a1.text > b1.text) ? 1 : -1;
        } else {
            return (a1.icon > b1.icon) ? 1 : -1;
        }
    }
    /*for(typee in tree["types"]){
        if("icon" in tree["types"][typee]){
            tree["types"][typee]["icon"]=tree["types"][typee]["icon"].replace("https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/",baseurl+"icons/")
        }
    }
    console.log(tree["types"])
    */
    tree["contextmenu"]["items"]=function (node) {
        nodetype=node.type
        thelinkpart="class"
        if(nodetype=="instance" || nodetype=="geoinstance"){
            thelinkpart="instance"
        }
        contextmenu={
            "lookupdefinition": {
                "separator_before": false,
                "separator_after": false,
                "label": "Lookup definition",
                "icon": "https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/searchclass.png",
                "action": function (obj) {
                    newlink=normalizeNodeId(node)
                    var win = window.open(newlink, '_blank');
                    win.focus();
                }
            },
            "copyuriclipboard":{
                "separator_before": false,
                "separator_after": false,
                "label": "Copy URI to clipboard",
                "icon": "https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/"+thelinkpart+"link.png",
                "action":function(obj){
                    copyText=normalizeNodeId(node)
                    navigator.clipboard.writeText(copyText);
                }
            },
            "discoverrelations":{
                "separator_before": false,
                "separator_after": false,
                "label": "Discover "+node.type+" relations",
                "icon": "https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/"+thelinkpart+"link.png",
                "action":function(obj){
                    console.log("class relations")
                    if(node.type=="class" || node.type=="halfgeoclass" || node.type=="geoclass" || node.type=="collectionclass"){
                        getClassRelationDialog(node)
                    }
                }
            },
            "loaddataschema": {
                "separator_before": false,
                "separator_after": false,
                "icon":"https://cdn.jsdelivr.net/gh/i3mainz/geopubby@master/public/icons/"+node.type+"schema.png",
                "label": "Load dataschema for "+node.type,
                "action": function (obj) {
                    console.log(node)
                    console.log(node.id)
                    console.log(baseurl)
                    if(node.id.includes(baseurl)){
                        getDataSchemaDialog(node)
                    }else if(node.type=="class" || node.type=="halfgeoclass" || node.type=="geoclass" || node.type=="collectionclass"){
                        getDataSchemaDialog(node)
                    }
                }
            }
        }
        return contextmenu
    }
    $('#jstree').jstree(tree);
    $('#jstree').bind("dblclick.jstree", function (event) {
        var node = $(event.target).closest("li");
        var data = node[0].id
        if(data.includes(baseurl)){
            console.log(node[0].id)
            console.log(normalizeNodeId(node[0]))
            followLink(normalizeNodeId(node[0]))
        }else{
            window.open(data, '_blank');
        }
    });
    var to = false;
	$('#classsearch').keyup(function () {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
            var v = $('#classsearch').val();
            $('#jstree').jstree(true).search(v,false,true);
        });
    });
}