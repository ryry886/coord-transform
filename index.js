import transProj4 from "./src/transProj4"
function transformArray(array,transOption){
    if(! (array[0] instanceof Array)){
        return transProj4(array,transOption)
    }else{
        array = array.map((item)=>{
        return transformArray(item,transOption)
       })
       return array
    }
}
function transform(geojsonOrArray,transOption){
    if(geojsonOrArray.constructor == Array){
        return transformArray(geojsonOrArray,transOption)
    }else if(geojsonOrArray.constructor == Object){
        switch(geojsonOrArray.type){
            case "FeatureCollection":
                geojsonOrArray.features.map((item)=>{
                    item.geometry.coordinates = transformArray(item.geometry.coordinates,transOption)
                    return item
                })
                break;
            case "Feature":
                geojsonOrArray.map((item)=>{
                    item.geometry.coordinates = transformArray(item.geometry.coordinates,transOption)
                    return item
                })
                break;
            case "Point":
            case "MultiPoint":
            case "LineString":
            case "MultiLineString":
            case "Polygon":
            case "MultiPlygon":
                geojsonOrArray.coordinates =  transformArray(geojsonOrArray.coordinates,transOption)
                break;
            case "GeometryCollection":
                geojsonOrArray.geometries.map((item)=>{
                    item.coordinates = transformArray(item.coordinates,transOption)
                    return item
                })
                break;
        }
        return geojsonOrArray;
    }
}
export default transform
