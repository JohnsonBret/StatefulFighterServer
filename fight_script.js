var heroStartHealth;
var heroHealth;
var villianStartHealth;
var villianHealth;

var messages = [];
var startDelay = 3000;
var fightDelay = 1000;
var isHeroTurn = true;

function StatefulBattle()
{
  StartBattle(); 
}


//*****************************************
//Start Battle Section - StartBattle();
//*****************************************

function StartBattle()
{
  clearRootChildren();
  LogStartMessage();
  setHeroAndVillainStartingHealth();
  LogStartingHealth();
  initalizeHealthBar();
  GetInitialWinLossStatsFromDB();
  setTimeout(FightBattle, startDelay);
}

function LogStartMessage()
{
  var battleStartMessage = "The Battle has started! Brace yourself for Combat";
  createHeadingHtml(battleStartMessage);
}

function setHeroAndVillainStartingHealth()
{
  heroStartHealth = Math.round(Math.random() * 100);
  villianStartHealth = Math.round(Math.random() * 100);
  heroHealth = heroStartHealth;
  villianHealth = villianStartHealth;
}

function LogStartingHealth()
{
  var battleStartHealthMessage = "At the start of the battle the hero has " + heroHealth + " health and the villian has " + villianHealth;
  createParagraphHtml(battleStartHealthMessage);
}

function initalizeHealthBar()
{
  updateHealthBar("VillainHp", "100%")
  updateHealthBar("heroHp", "100%")
}

//*****************************************
//Fight Battle Section - FightBattle();
//*****************************************

function FightBattle()
{
  LogFightBattleOngoingMessage();
  RunBattleLoop();
}

function LogFightBattleOngoingMessage()
{
  var fightBattleOngoingMessage = "The Battle is Ongoing!";
  createParagraphHtml(fightBattleOngoingMessage);
}

function RunBattleLoop()
{
  
  clearRootChildren();
  
  
  if(isHeroTurn)
  {
    heroAttack();
    isHeroTurn = false;
  }
  else
  {
    villianAttack();
    isHeroTurn = true;
  }
  
  if(heroHealth > 0 && villianHealth > 0)
  {
    setTimeout(RunBattleLoop, fightDelay);
  }
  else
  {
    EndBattle();  
  }
  
}

function heroAttack()
{
  var heroDamage = Math.round(Math.random() * 10);
  var heroDamageMessage = "The Hero strikes the villain for " + heroDamage;
  createParagraphHtml(heroDamageMessage);
  villianHealth = villianHealth - heroDamage;
  updateHealthBar("VillainHp", getVillainPercentageHpLeft());
}

function villianAttack()
{
  var villianDamage = Math.round(Math.random() * 10);
  var villianDamageMessage = "The Villian strikes the hero for " + villianDamage;
  createParagraphHtml(villianDamageMessage);
  heroHealth = heroHealth - villianDamage;
  updateHealthBar("heroHp", getHeroPercentageHpLeft())
}


function updateHealthBar(healthBar, percentage)
{
  var changeHealthBar = document.getElementById(healthBar);
  changeHealthBar.style.width = percentage;
  var barWidth = changeHealthBar.style.width;
}

function getHeroPercentageHpLeft()
{
  var percent;
  if(heroHealth <= 0)
  {
    percent = 0;    
  }
  else
  {
    percent = heroHealth / heroStartHealth;
    percent = Math.round(percent * 100);
  }
  
  return percent.toString() + "%";
}

function getVillainPercentageHpLeft()
{
  var percent;
  
  if(villianHealth <= 0)
  {
    percent = 0;  
  }
  else
  {
    percent = villianHealth / villianStartHealth;
    percent = Math.round(percent * 100);
  }
  
  return percent.toString() + "%";
}


//*****************************************
//End Battle Section - EndBattle()
//*****************************************

function EndBattle()
{
  
  LogEndBattleMessage();
  DetermineTheVictor();
}

function LogEndBattleMessage()
{
  console.log("End Battle");
  var EndBattleHeadingMessage = "The Battle has Ended!";
  createHeadingHtml(EndBattleHeadingMessage);
}

function DetermineTheVictor()
{
  
  var DetermineVictorMessage;
  let Victor;
  
  if(heroHealth <=0 && villianHealth <= 0)
  {
    DetermineVictorMessage = "The Villain and Hero have perished in mutual combat.  The Villian Kamikazed the Hero...:<";
    Victor = "None";
  }
  else if(heroHealth > 0)
  {
    DetermineVictorMessage = "The Hero is victorious - His health is " + heroHealth + " The villian has " + villianHealth;
    Victor = "Hero";
  }
  else
  {
    DetermineVictorMessage = "The villian wins his health is: " + villianHealth + " The hero has " + heroHealth;
    Victor = "Villian";
  }
  SendBattleResultsToServer(Victor, heroHealth, villianHealth);
  createParagraphHtml(DetermineVictorMessage);
  
}

//*************************************************
//This section sends results to the Server and DB
//*************************************************

function SendBattleResultsToServer(winner, heroHealth, villianHealth)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Got XMLHTTP Request Response")
      addDatabaseResponseToStats(xhttp.response);
    }
  };
  xhttp.open("GET", `http://localhost:8080/results?winner=${winner}&heroHealth=${heroHealth}&villianHealth=${villianHealth}`, true);
  xhttp.send();
  console.log("XMLHTTP Request Sent")
}

function GetInitialWinLossStatsFromDB()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("Got XMLHTTP Request Response")
      addDatabaseResponseToStats(xhttp.response);
    }
  };
  xhttp.open("GET", `http://localhost:8080/stats`, true);
  xhttp.send();
  console.log("XMLHTTP Request Sent")
}

function addDatabaseResponseToStats(response)
{
  console.log(JSON.parse(response));
  var responseJSON = JSON.parse(response);

  clearStatsChildren();
  addHtmlToStats("h2", `Hero Wins: ${responseJSON[0].total}`);
  addHtmlToStats("h2", `Villian Wins: ${responseJSON[1].total}`);
}

//*****************************************
//This section handles our Messages Array
//*****************************************
function addHeadingOneMessageToArray(msgText)
{
  messages.push({message : msgText, element: "h1"});
}

function addParagraphMessageToArray(msgText)
{
  messages.push({message : msgText, element: "p"});
}

function displayStoredMessagesDelayed()
{
  displayMessage();
  
  if(messages.length > 0)
  {
    setTimeout(displayStoredMessagesDelayed, 1000);
  }
}

function displayMessage()
{
  
  var firstMessage;
  
  
  if(messages.length > 0)
  {
    firstMessage = messages.shift();
    console.log("First msg Element " + firstMessage.element);
  }
  else
  {
    return;
  }
  
  if(firstMessage.element == "p")
  {
    createParagraphHtml(firstMessage.message);  
  }
  else if(firstMessage.element == "h1")
  {
      createHeadingHtml(firstMessage.message);
  }
  
  console.log("Display Message -> " + firstMessage.message);
}


//*****************************************
//This section creates HTML
//*****************************************
function addHtmlToBattleRoot(element, textValue)
{
  var element = document.createElement(element);
  element.textContent = textValue;
  document.getElementById("battleRoot").appendChild(element);
}

function addHtmlToStats(element, textValue)
{
  var element = document.createElement(element);
  element.textContent = textValue;
  document.getElementById("statsContainer").appendChild(element);
}

function createHeadingHtml(textToWrite)
{
  addHtmlToBattleRoot("h1", textToWrite);
  console.log(textToWrite);
}

function createParagraphHtml(textToWrite)
{
  addHtmlToBattleRoot("p", textToWrite);
  console.log(textToWrite);
}

function clearRootChildren()
{
  var rootNode = document.getElementById("battleRoot");
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
}

function clearStatsChildren()
{
  var rootNode = document.getElementById("statsContainer");
  while (rootNode.firstChild) {
    rootNode.removeChild(rootNode.firstChild);
  }
}