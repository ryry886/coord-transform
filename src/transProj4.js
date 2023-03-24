import proj4 from "proj4";
import Trans from "./trans"

function transProj4(array,transOption){
  const {from, to}  = transOption;
  if(transOption.proj4){
    return proj4(from,to,array)
  } else{
    let functionName = `${from}to${to}`
    return Trans[functionName](array)
  }
}
export default transProj4