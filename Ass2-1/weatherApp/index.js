console.log("Running");
const http=require("http");
const fs=require("fs");

var requests=require("requests");

const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
    const num1=orgVal.main.temp-273.15732;
    const num2=orgVal.main.temp_min-273.15732;
    const num3=orgVal.main.temp_max-273.15732;
let temperature=tempVal.replace("{%tempval%}",num1.toFixed(2));
temperature=temperature.replace("{%tempmin%}",num2.toFixed(2));
temperature=temperature.replace("{%tempmax%}",num3.toFixed(2));
temperature=temperature.replace("{%location%}",orgVal.name);
temperature=temperature.replace("{%country%}",orgVal.sys.country);
temperature=temperature.replace("{%main%}",orgVal.weather[0]["main"]);
temperature=temperature.replace("{%description%}",orgVal.weather[0]["description"]);

return temperature;

}

const server=http.createServer((req,res) =>{

    if(req.url=="/")
    {
        console.log("Inside req");
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=3ca2e81cada743a0af1c5d503cde4ae1")
        .on("data",(chunk)=>{
            const objData=JSON.parse(chunk);
            const arrData=[objData];
            console.log("just before printing temp");
            console.log(arrData[0].main.temp);

            const realTimeData=arrData
            .map((val)=>
            replaceVal(homeFile,val))
            .join("");
           // console.log(val.main);
            res.write(realTimeData);
        })
        .on("end",(err)=>{
      if(err)
          return  console.log("connection close due to error :",err);
          res.end();
        });
    } 
});

server.listen(8000,"127.0.0.1");
console.log("Exit");
