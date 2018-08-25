const htmlparser = require('htmlparser');
const request = require('request');

const getMeets = (year, callback) => {
    const handler = new htmlparser.DefaultHandler((err, dom) => {
        if (err) {
            console.log('error found');
        } else {
            console.log('handler initialized');
        }
    });

    const parser = new htmlparser.Parser(handler);
    request(`http://trackdatabase.com/?year=${year}`, (error, response, body) => {
      if (response.statusCode !== 200) {
        // TODO add error for callback method
        callback(error, undefined);
        return;
      }
      parser.parseComplete(body);
      const parsedData = handler.dom;
      const allMeetsRaw = parsedData[2].children[3].children[1].children[3].children[1].children[11].children[3].children[1].children[1].children;
      const allMeets = [];
      allMeetsRaw.forEach((item, i) => {
        if (item.type !== 'text' && item.children.length < 5) {
            let location = 'Not Available';
            let status = 'team info';
            let posted = 'Not Avaliable';
            let id = 'Not Available';
            try {
                location = item.children[3].children[0].data;
                posted = item.children[2].children[0].children[0].data;
                id = item.children[0].children[0].attribs.href.substring(item.children[0].children[0].attribs.href.indexOf('=') + 1);
                if (item.children[0].children[0].attribs.href.includes('viewmeet')) {
                    status = 'results avaliable';
                }
            } catch (e) {
                // If bounce then nothing happens
            }
            allMeets.push({
                name: item.children[0].children[0].children[0].data,
                id,
                date: item.children[1].children[0].data,
                location,
                posted,
                link: `http://trackdatabase.com/${item.children[0].children[0].attribs.href}`,
                status,
            });
        }
      });
      callback(allMeets);
    });
};

const getMeetDetails = (meet, callback) => {
    const handler = new htmlparser.DefaultHandler((err, dom) => {
        if (err) {
            console.log('error found');
        } else {
            console.log('handler set');
        }
    });

    const parser = new htmlparser.Parser(handler);
    request(meet.link, (err, response, body) => {
        if (response.statusCode !== 200) {
            // TODO add error for callback method
            throw new Error('Request made to track database failed.');
        }
        parser.parseComplete(body);
        const parsedData = handler.dom;
        const data = [];
        if (meet.status === 'team info') {
            const dataRaw = parsedData[2].children[3].children[1].children[3].children[1];
            const generalDataRaw = dataRaw.children[1].children;
            const teamsDataRaw = dataRaw.children[2].children;
            const teamData = [];
            teamsDataRaw.forEach((item, i) => {
                if (i > 0 && item.type !== 'comment') {
                    teamData.push({
                        name: item.children[1].children[0].data,
                        count: {
                            athletes: parseInt(item.children[2].children[0].data, 10),
                            entries: parseInt(item.children[3].children[0].data, 10),
                        },
                    });
                }
            });
            const meetInfo = {
                name: generalDataRaw[1].children[1].children[0].data,
                closing: generalDataRaw[2].children[3].children[0].data,
                location: generalDataRaw[3].children[3].children[0].data.includes('&nbsp') ? 'Not Avaliable' : generalDataRaw[3].children[3].children[0].data,
                date: generalDataRaw[1].children[3].children[0].data,
                entryCount: {
                    teams: parseInt(generalDataRaw[5].children[1].children[0].data, 10),
                    athlets: parseInt(generalDataRaw[6].children[1].children[0].data, 10),
                    entries: parseInt(generalDataRaw[7].children[1].children[0].data, 10),
                },
                teams: teamData,
                posted: false,
            };
            callback(meetInfo);
        } else if (meet.status === 'results avaliable') {
            const resultsRaw = parsedData[2].children[3].children[1].children[3].children[1].children[2].children[1].children[1].children[1].children;
            resultsRaw.forEach((item, i) => {
                if (item.type !== 'text' && i > 1) {
                    let ageGroup = 'Not Avaliable';
                    let gender = 'Not Avaliable';
                    let name = 'Not Avaliable';
                    let link = 'Not Avaliable';
                    try {
                        ageGroup = item.children[1].children[0].data;
                    } catch (e) {
                        console.log('Error parsing age group');
                    }
                    try {
                        gender = item.children[3].children[0].data;
                    } catch (e) {
                        console.log('Error parsing gender');
                    }
                    try {
                        name = item.children[5].children[0].data;
                    } catch (e) {
                        console.log('Error parsing name');
                    }
                    try {
                        link = `http://trackdatabase.com/${item.children[10].children[0].attribs.href}`;
                    } catch (e) {
                        console.log('Error parsing link');
                    }
                    data.push({
                        division: ageGroup,
                        gender,
                        name,
                        link,
                    });
                }
            });
            callback({ events: data, posted: true });
        } else {
            throw new Error('Failed to recognize the collected data.');
        }
    });
};

const Crawler = {
    getMeets,
    getMeetDetails,
};

module.exports = Crawler;
