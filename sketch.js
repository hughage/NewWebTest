var bgColour = [184,230,194];
var slothClosed;
var slothOpen;
var userSpeech = "Ask me for a joke or whatever";

var speaking = false;
var speech = new p5.Speech();


var voiceNumber = 74;
var voiceName = "Google 日本語";

var voiceOptionsBox;
var mic; 
var vol;
var openThreshold = 0.02;

var database;

var sessionData;
var myId;

function setup() {
      
      // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBz7BlIvwkIU9LoPyXOmp-SjU141h3Fb1s",
        authDomain: "jstest-b4d29.firebaseapp.com",
        databaseURL: "https://jstest-b4d29.firebaseio.com",
        projectId: "jstest-b4d29",
        storageBucket: "",
        messagingSenderId: "237496183809"
    };
    
    firebase.initializeApp(config);
    
    console.log("Firebase object:");
    console.log(firebase);
    console.log("End of firebase object.");
    database = firebase.database();
    
    myId = day()+""+month()+""+year()+""+hour()+""+minute()+""+second()+"A"+round(random(10000));
    //var myId = "30304838289";
    console.log("ID: "+myId);
     
     sessionData = {
         ID: myId,
         Hour: hour(),
         Minute: minute(),
         Second: second(),
         Day: day(),
         Month: month(), 
         Year: year()      
     };
    
    postTo(sessionData);
        
    speech.onEnd = speechEnd;
    createCanvas(windowWidth,windowHeight);
    background(0);
    slothClosed = loadImage("assets/slothClosed.png");  // Load the image
    slothOpen = loadImage("assets/slothOpen.png");

   // let speech = new p5.Speech();
    let speechRec = new p5.SpeechRec('en-US', gotSpeech);
    let continuous = true;
    let interim = false;
    
    mic= new p5.AudioIn();
    mic.start();

    speechRec.start(continuous, interim);

    let bot = new RiveScript();
    bot.loadFile("brain.rive", brainReady, brainError);

    function brainReady() {
        console.log('Chatbot ready!');
        bot.sortReplies();
    }

    function brainError() {
        console.log('Chatbot error!')
    }
    
    function gotSpeech() {
    if (speechRec.resultValue) {
        let input = speechRec.resultString;
        let reply = bot.reply("local-user", input);
        userSpeech = input;
        speech.speak(reply);  
        
        var userTemp = {
            who: myId,
            what: input,
            when: now()
        }
        postTo(userTemp);
               
        var botTemp = {
            who: "Bot",
            what: reply,
            when: now()
            }
        postTo(botTemp);
        }
    }

    voiceOptionsBox = createSelect();
    voiceOptionsBox.position((width/2)-60,height-30);
    voiceOptionsBox.changed(newVoicePlease);

  }
    

function now(){
    var time = { Hour: hour(),Minute: minute(),Second: second()};
    return(time);
}

function postTo($){
    var myTopSecretData = database.ref(myId);  
    var importantData = $;  
    myTopSecretData.push(importantData, finished);
}

function finished(error) {
  if (error) {
    console.log('ooops');
  } else {
    console.log('data saved!');
  }
}


function printVoiceNmes(){ 
    for(var i = 0;i<speech.voices.length;i++){
    voiceOptionsBox.option(speech.voices[i].name);
    }
    
    voiceOptionsBox.value(speech.voices[voiceNumber].name);
    
    speech.setVoice(voiceNumber);
    voiceName = speech.voices[voiceNumber].name;
    
    speech.speak('Haaaaaaaaaaaaaaaaa rrrrr...... hello mate.....I was just laughing at one of my very funny jokes..... you can ask me for one if you want matey?');
}

function newVoicePlease(){
    console.log("Tits "+voiceOptionsBox.value());
    var temp =0;
    for(var i = 0;i<speech.voices.length;i++){
        if(speech.voices[i].name.includes(voiceOptionsBox.value())){
            temp = i;
            i = speech.voices.length;
        }
    }
    voiceNumber=temp;
    console.log(temp);
    speech.setVoice(temp);
    speech.speak("My voice name is "+voiceOptionsBox.value()+"\n........ nice to meet you...by the way.... in case you were wondering.... my jokes are killer"+temp);
}

function speechEnd(){
    console.log("Boooooom");
}

function draw() {
    background(bgColour);
    if(mic.getLevel() > openThreshold){
       image(slothOpen, width/2-(slothOpen.width/2), height-slothOpen.height); 
    } else {
        image(slothClosed, width/2-(slothClosed.width/2), height-slothClosed.height); 
    }  
    textAlign(CENTER);
    textSize(100);
    fill(255);       
    text(userSpeech,  width/7, 0, 6*(width/7), height);
    textSize(20);
}
