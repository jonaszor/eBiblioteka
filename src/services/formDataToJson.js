export default function fDataToJSON(formData){
   var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    var json = JSON.stringify(object); 
    return json;
}
