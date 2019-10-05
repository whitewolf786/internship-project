// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
 var flights=[{name:'indigo',depart1:'ahmedabad',dest:'mumbai',cost:3000,id:1},
    {name:'Etihad',depart1:'ahmedabad',dest:'dubai',cost:5000,id:2},
    {name:'KIngfisher',depart1:'ahmedabad',dest:'mumbai',cost:2000,id:3},
    {name:'Emirates',depart1:'dubai',dest:'mumbai',cost:7000,id:4},
    {name:'indigo',depart1:'mumbai',dest:'ahmedabad',cost:4000,id:5},
    {name:'JetAirways',depart1:'ahmedabad',dest:'mumbai',cost:6000,id:6},
    {name:'indigo',depart1:'delhi',dest:'mumbai',cost:300,id:7},
    {name:'AirIndia',depart1:'ahmedabad',dest:'mumbai',cost:8000,id:8}];
    
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}

  
 /*function dateSelect(agent)
 {
     
     var today=new Date();
     if((date.getDate()<today.getDate()) && (date.getMonth()<today.getMonth()) && (date.getYear()<today.getYear()))
     {
         agent.add("Invalid date");
         
     }
     else
     {
         agent.add("Flight booked");
     }
 }*/
 // var dispFlights=new Array(8);
 function select(agent)
 {
    
     var cnt=1;
     
     //agent.add(pass+'');
     var depart=agent.parameters.depart.toLowerCase();
     var dest=agent.parameters.dest.toLowerCase();
     var cost=agent.parameters.Cost;
     
     var flag=0;
     agent.add("Following choices are available:\n")
     for(var i=0;i<flights.length;i++)
     {
        /* if(((agent.parameters.depart1==flights[i].depart) || (agent.parameters.dest==flights[i].dest)) && (flights[i].cost<=agent.parameters.cost))
         {
             agent.add("name:"+flights[i].name+"\nJourney:"+flights[i].depart1+" to "+flights[i].dest
             +"Date of travelling"+agent.parameters.date+"Cost per head:"+flights[i].cost);
         }*/
         
         if((depart==flights[i].depart1) && (dest==flights[i].dest ) && (Number(flights[i].cost)<=cost))
         {
             
            // dispFlights[cnt]=flights[i].id;
             agent.add(cnt+"] Flight:"+flights[i].name+"\n\nCost:"+flights[i].cost+"\n\nID:-"+flights[i].id);
             flag=1;
             cnt=cnt+1;
             
         }
          
         
     }
     if(flag==0)
         {
             agent.add("sorry we dont have any flights for you");
         }
 }
 function selectFlight(agent)
 {
      var day=new Date(agent.parameters.date);
      var pass=agent.parameters.passenger; 
      var ch=agent.parameters.choice;
    
     
     
    
     //var pass=agent.parameters.passenger;
     
     for(var i=0;i<flights.length;i++)
     {
         if(ch==flights[i].id)
         {
           
             
             agent.add("Name:"+flights[i].name+"\nJourney:"+flights[i].depart1+"-to-"+flights[i].dest+"\nDate:"+day.getDate()+"\\"+(parseInt(day.getMonth())+1)+"\\"+day.getFullYear()+''+"cost:"+pass*flights[i].cost);
             
         }
     }
     agent.add("should i confirm flight?");
 }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Booking', select);
  intentMap.set('flight-select', selectFlight);
  intentMap.set('flight-select-no', select);

  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
