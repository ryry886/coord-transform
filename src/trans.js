/**
 * 提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换
 */
//定义一些常量
const x_PI = (3.14159265358979323 * 3000.0) / 180.0;
const PI = 3.14159265358979323; // π
const a = 6378245.0; //长半轴
const ee = 0.00669342162296594323; // 扁率

const Trans = {
  
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 高德
   * @param bdArray  [bd_lon,bd_lat]
   * @returns {*[]}
   */
  BD09toGCJ02: function (bdArray) {
    var bd_lon = bdArray[0];
    var bd_lat = bdArray[1];
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  },

  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即高德 转 百度
   * @param gcj02Array  [lng, lat]
   * @returns {*[]}
   */
  GCJ02toBD09: function (gcj02Array) {
    var lng = gcj02Array[0];
    var lat = gcj02Array[1];
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  },

  /**
   * WGS84转GCj02
   * @param wgs84Array [lng, lat]
   * @returns {*[]}
   */
  WGS84toGCJ02: function (wgs84Array) {
    var lng = wgs84Array[0];
    var lat = wgs84Array[1];
    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = this.transformlat(lng - 105.0, lat - 35.0);
      var dlng = this.transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat];
    }
  },

  /**
   * GCJ02 转换为 WGS84
   * @param lng
   * @param lat
   * @returns {*[]}
   */
  GCJ02toWGS84: function (gcj02Array) {
    var lng = gcj02Array[0];
    var lat = gcj02Array[1];
    if (this.out_of_china(lng, lat)) {
      return [lng, lat];
    } else {
      var dlat = this.transformlat(lng - 105.0, lat - 35.0);
      var dlng = this.transformlng(lng - 105.0, lat - 35.0);
      var radlat = (lat / 180.0) * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
      dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat];
    }
  },
  BD09toWGS84:function(bd09Array){
    let gcj02Array = this.BD09toGCJ02(bd09Array);
    return this.GCJ02toWGS84(gcj02Array);
  },

  WGS84toBD09:function(wgs84Array){
    let gcj02Array = this.WGS84toGCJ02(wgs84Array);
    return this.GCJ02toBD09(gcj02Array);
  },

  transformlat: function (lng, lat) {
    var ret =
      -100.0 +
      2.0 * lng +
      3.0 * lat +
      0.2 * lat * lat +
      0.1 * lng * lat +
      0.2 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((160.0 * Math.sin((lat / 12.0) * PI) +
        320 * Math.sin((lat * PI) / 30.0)) *
        2.0) /
      3.0;
    return ret;
  },

  transformlng: function (lng, lat) {
    var ret =
      300.0 +
      lng +
      2.0 * lat +
      0.1 * lng * lng +
      0.1 * lng * lat +
      0.1 * Math.sqrt(Math.abs(lng));
    ret +=
      ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
        2.0) /
      3.0;
    ret +=
      ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
      3.0;
    ret +=
      ((150.0 * Math.sin((lng / 12.0) * PI) +
        300.0 * Math.sin((lng / 30.0) * PI)) *
        2.0) /
      3.0;
    return ret;
  },

  /**
   * 粗略判断是否在国内，不在国内则不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  out_of_china: function (lng, lat) {
    return (
      lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271 || false
    );
  },
};
export default Trans;
