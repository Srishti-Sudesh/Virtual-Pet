var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood, timeButton;
var foodObj, feedTime, lastFed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedit=createButton("Feed The Dog");
  feedit.position(880,95);
  feedit.mousePressed(feedDog);

  timeButton = createSprite(650,54,160,20);
  timeButton.shapeColor = "lightgrey";
}

function draw() {
  background(46,139,87);
  drawSprites();

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  fill("black");
  textSize(13);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed % 12 + " PM", 600, 58);
   }else if(lastFed==0){
     text("Last Feed : 12 AM", 600, 58);
   }else{
     text("Last Feed : " + lastFed + "AM", 600, 58);
   }
   
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);
  var foodStock_val = foodObj.getFoodStock();
  if(foodStock_val <= 0){
    foodObj.updateFoodStock(foodStock_val * 0);
  }
  else{
    foodObj.updateFoodStock(foodStock_val - 1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  });
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
