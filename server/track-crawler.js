let htmlparser = require("htmlparser");
let request = require("request");

const getMeets = (year, callback) =>{
    let handler = new htmlparser.DefaultHandler((err, dom) => {
        if(err){
            console.log("error found");
        }else{
        }
    });

    let parser = new htmlparser.Parser(handler);

    request('http://trackdatabase.com/?year='+year, (error, response, body) => {
      if(response.statusCode !== 200){
        // TODO add error for callback method
        callback(error, undefined);
        return;
      }
      parser.parseComplete(body);
      let parsedData = handler.dom;
      let allMeetsRaw = parsedData[2].children[3].children[1].children[3].children[1].children[11].children[3].children[1].children[1].children;
      let allMeets = [];
      allMeetsRaw.forEach((item, i) => {
        if(item.type !== "text" && item.children.length < 5){
            let location = "Not Avaliable";
            let status = "team info";
            let posted = "Not Avaliable"
            try{
                location = item.children[3].children[0].data;
                posted = item.children[2].children[0].children[0].data;
                if(item.children[0].children[0].attribs.href.includes("viewmeet")){
                    status = "results avaliable";
                }
            }catch(e){
                // If bounce then nothing happens
            }
            allMeets.push({
                name: item.children[0].children[0].children[0].data,
                date: item.children[1].children[0].data,
                location: location,
                posted: posted,
                link: "http://trackdatabase.com/" + item.children[0].children[0].attribs.href,
                status: status
            });
        }
      });
      callback(allMeets);
    })
}

const getMeetDetails = (meet, callback) => {
    let handler = new htmlparser.DefaultHandler((err, dom) => {
        if(err){
            console.log("error found");
        }else{
        }
    });

    let parser = new htmlparser.Parser(handler);
    request(meet.link, (err, response, body)=>{
        if(response.statusCode !== 200){
            // TODO add error for callback method
            throw new Error("Request made to track database failed.");
        }
        parser.parseComplete(body);
        const parsedData = handler.dom;
        let data = [];
        if(meet.status === "team info"){
            let dataRaw = parsedData[2].children[3].children[1].children[3].children[1];
            let generalDataRaw = dataRaw.children[1].children;
            let teamsDataRaw = dataRaw.children[2].children;
            let teamData = [];
            teamsDataRaw.forEach((item, i)=>{
                if(i > 0 && item.type !== "comment"){
                    teamData.push({
                        name: item.children[1].children[0].data,
                        count: {
                            athletes: parseInt(item.children[2].children[0].data),
                            entries: parseInt(item.children[3].children[0].data)
                        }
                    });
                }
            });
            const meetInfo = {
                name: generalDataRaw[1].children[1].children[0].data,
                closing: generalDataRaw[2].children[3].children[0].data,
                location: generalDataRaw[3].children[3].children[0].data.includes("&nbsp") ? "Not Avaliable" : generalDataRaw[3].children[3].children[0].data,
                date: generalDataRaw[1].children[3].children[0].data,
                entryCount: {
                    teams: parseInt(generalDataRaw[5].children[1].children[0].data),
                    athlets: parseInt(generalDataRaw[6].children[1].children[0].data),
                    entries: parseInt(generalDataRaw[7].children[1].children[0].data)
                },
                teams: teamData,
                posted: false
            }
            callback(meetInfo)
            
        }else if(meet.status === "results avaliable"){
            let resultsRaw = parsedData[2].children[3].children[1].children[3].children[1].children[2].children[1].children[1].children[1].children;
            resultsRaw.forEach((item, i)=>{
                if(item.type !== "text" && i > 1){
                    let ageGroup = "Not Avaliable", gender = "Not Avaliable", name = "Not Avaliable", link = "Not Avaliable";
                    try{
                        ageGroup = item.children[1].children[0].data;
                    }catch(e){}
                    try{
                        gender = item.children[3].children[0].data;
                    }catch(e){}
                    try{
                        name = item.children[5].children[0].data;
                    }catch(e){}
                    try{
                        link = "http://trackdatabase.com/" + item.children[10].children[0].attribs.href;
                    }catch(e){}
                    data.push({
                        division: ageGroup,
                        gender: gender,
                        name: name,
                        link: link
                    });
                }
            });
            callback({events: data, posted: true});
        }else{
            throw new Error("Failed to recognize the collected data.")
            return;
        }
    });
}

const Crawler = {
    getMeets: getMeets,
    getMeetDetails: getMeetDetails
}

module.exports = Crawler;