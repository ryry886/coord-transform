# coord-transform
wgs84，高德，百度之间的坐标转换,以及用proj4自定义转换，不改变数据结构
## api
transform(geojsonOrArray,transOption)
```
geojsonOrArray: 数组或者标准geojson格式
//wgs84，高德，百度之间的坐标转换
transOption: {
                from:"WGS84", // WGS84, BD09,GCJ02
                to:"BD09",  // WGS84, BD09,GCJ02
                proj4:false
            }
//proj4参数转换
transOption: {
                from:"+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=GRS80 +units=m +no_defs",
                to:"+proj=longlat +ellps=GRS80 +no_defs",
                proj4:true
            }
 ```
## 使用 
### NPM
npm install coord-transform
```
import  transform  from "coord-transform"
//传入数组
transform([114.331754,30.478323],{from:"WGS84",to:"GCJ02"})

//传入嵌套数组
transform([[114.331754,30.478323],[114.331754,30.478323]],{from:"BD09",to:"WGS84"})

//传入geojson
let option={
    from:"+proj=tmerc +lat_0=0 +lon_0=111 +k=1 +x_0=37500000 +y_0=0 +ellps=GRS80 +units=m   +no_defs",
    to:"+proj=longlat +ellps=GRS80 +no_defs",
    proj4:true,
}
let geojson = {
        "type": "FeatureCollection",
        "features": [
            { "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [37488855.08,3514760.39]},
                "properties": {
                    "name": "Location A",
                    "category": "Store"
                }
            },
            { "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [37488855.08,3514760.39]},
                "properties": {
                    "name": "Location B",
                    "category": "House"
                }
            },
            { "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [37488855.08,3514760.39]},
                "properties": {
                    "name": "Location C",
                    "category": "Office"
                }
            }
        ]
    }
transform(geojson,option);
 ```


