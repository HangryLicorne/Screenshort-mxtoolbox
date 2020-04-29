const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, frame: false, useContentSize: true });

const screenshotSelector = require('nightmare-screenshot-selector');
Nightmare.action('screenshotSelector', screenshotSelector)

function captureDnsMxToolBox (host) {
    nightmare.on('console', console.log.bind(console));
    nightmare
        .useragent("Mozilla/72.0.2 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36")
        .goto('https://mxtoolbox.com/domain/' + host)

        .wait(function () { const a = document.querySelector('#spanTestsRemaining'); return (a.innerHTML === 'Complete') })
        
        .click('div.col-xs-4:nth-child(4) > a:nth-child(1)')
        
        .evaluate(() => {
            document.querySelector('#aspnetForm > div:nth-child(8) > footer').remove()

            const selectorElement = [];
            const smtpResults = document.querySelector('#smtpResults');
            const smtpResultsChildNodes = smtpResults.childNodes;

            for (var j = 0; j < smtpResultsChildNodes.length; j++) {

                for (var k = 0; k < smtpResultsChildNodes[j].children.length; k++) {

                    const typeOfSmtpElement = smtpResultsChildNodes[j].children[k].localName;

                    if (typeOfSmtpElement == "table") {

                        k = k + 1;
                        selectorElement.push("#" + smtpResultsChildNodes[j].id + " > table:nth-child(" + k.toString() + ")");
                    }

                    if (typeOfSmtpElement == "div") {
                        k = k + 1;
                        selectorElement.push("#" + smtpResultsChildNodes[j].id + " > div:nth-child(" + k.toString() + ")");
                    }
                }
            }

            return {
                smtp: selectorElement,
            };
        })
        .then(function (selector) {

            const selectorSmtpElements = selector.smtp;  
            
            var i = 0;    
            function take_screenshot(selectorSmtpElements) {
                console.log ("loop iteration number :"+ selectorSmtpElements[i]);
                var selectorElementSmtp = selectorSmtpElements[i];
                nightmare                    
                    .evaluate((selectorElementSmtp) => {
                        return new Promise(function(resolve) {
                            setTimeout(() => {
                                console.log("into setTimeout");
                                const captureElement = document.querySelector(selectorElementSmtp); // Find the HTML element to be captured in the DOM.
                                const captureRectSmtp = captureElement.getBoundingClientRect();                                
                                
                                var tableau = [];

                                tableau.push(captureRectSmtp.top);
                                tableau.push(captureRectSmtp.left);

                                console.log("top position :"+tableau[0]);
                                console.log("left position :"+tableau[1]);

                                resolve(tableau);
                                // return {
                                //     top: captureRectSmtp.top,
                                //     left: captureRectSmtp.left
                                // }                                
                            }, 3000)
                        });                                                                                                   
                    }, selectorElementSmtp)                                       
                    .then(function (array){
                        // setTimeout(() => {
                        console.log("position top :"+array[0]+" position left :"+array[1]);
                                                
                        nightmare                            
                            .scrollTo(array[0],array[1])
                            .wait(3000)
                            // .screenshot("capture"+i+".png")                                   
                            .screenshotSelector({ selector: selectorElementSmtp.toString(), path: "C:/Users/abakkas/Documents/CaptureTool/SmtpCaptures/" + host + i.toString() + '.png' })                            
                            .wait(3000)
                            // .then(nightmare.end())
                            // .catch((e) => console.dir(e));
                        // }, 9000)
                        i++;
                        if (i < selectorSmtpElements.length)
                        {
                            take_screenshot(selectorSmtpElements);
                        }                                                                                                                                                                       
                    })                    
                    // .then(nightmare.end())
                    // .catch((e) => console.dir(e));

                // i++;
                
                // if (i < selectorSmtpElements.length)
                // {
                //     take_screenshot(selectorSmtpElements);
                // }                
            }
            take_screenshot(selectorSmtpElements);
        })       
        // .then(function () {
        //     nightmare.end(function () {
        //     	console.log("done initial nightmare without error!");                
        //     });
        // });
}

var hosts = ['www.google.com'];

captureDnsMxToolBox(hosts);


