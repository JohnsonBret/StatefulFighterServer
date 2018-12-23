var heroHealth;
var villainHealth;

function StatefulBattle2()
{
  StartBattle();
  FightBattle();
  EndBattle();
  
  Math.round(10.1)
  10 / 1000
  
}

function StartBattle()
{
  console.log("The Battle Starts");
  
  heroHealth = Math.random() * 100;
  villainHealth = Math.random() * 100;
  
  console.log("The Hero Starts with : " + heroHealth + " The Enemy starts with : " + villainHealth);
  
}

function FightBattle()
{
  console.log("The Fight State");
  
  var heroAttackDamage = Math.random() * 10;
  villainHealth = villainHealth - heroAttackDamage;
  console.log("The Hero strikes the villain for " + heroAttackDamage + " damage!");
  
  var villianAttackDamage = Math.random() * 10;
  heroHealth = heroHealth - villianAttackDamage;
  console.log("The Hero strikes the villain for " + heroAttackDamage + " damage!");
  
}

function EndBattle()
{
  console.log("The Battle has Ended")
}