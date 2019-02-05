var X = 900;
var Y = 1280;
document.write("<canvas id='myCanvas' width=" + X + " height=" + Y + "></canvas>");


var BACKGROUND = "#7a6560";
var DETAIL = "#ac7560";
var LEVELS = [10,20,50,80,100];
var PAGE_X = 10;
var PAGE_Y = 200;

function dope_name() {
    var dope1 = ["Sour", "Southern", "Sweet", "Purple", "Dank", "Liquid", "Reggae", "Smurf"];
    var dope2 = ["Dank", "Gasoline", "Plant", "Dog", "69", "Juice"];
    return dope1[Math.floor(Math.random()*dope1.length)] + " " + dope2[Math.floor(Math.random()*dope2.length)];
}

function food_msg() {
    var m1 = ["kjøttkaker", "pannekaker", "Fjordland grøt", "pytt i panne", "kyllingnudler", "lasagne", "frokostblanding", "tomatsuppe", "salat", "taco", "hotdog", "sushi",
    "potetmos", "gryterett", "toast", "bakt potet"];
    var m2 = ["kjempegodt","fett ass","en erfaring", "ikke godt", "...", "nytt og spennende", "som heroin", "som bestemors", "vanskelig", "sterkt, wooo", "svampeaktig", "vellykket", "gøy" ];

    var msg = "Du lager " + m1[Math.floor(Math.random()*m1.length)] + " og det var " + m2[Math.floor(Math.random()*m2.length)];
    console.log(msg);
    return msg;
}

function employed_msg(name) {
    var m = [name  + " er ansatt", name + " har fått jobb!", "Nå er " + name + " med på laget!"];
    return m[Math.floor(Math.random()*m.length)];
}
function worker_name() {
    var work = ["Englefjes", "Slegga","Familiemedlemmet", "Kølla","Advokaten", "Knekten", "Lillegutt", "Sjåføren", "Muskelen", "Hjernen", "Klumpen", "Murmesteren"];
    
    return work[Math.floor(Math.random()*work.length)] + " (" + (20+Math.floor(Math.random()*25)) + ")" ;
}

function status_name(status) {
    if (status < 0) {
        return "BUSTED"
    }
    var criminal_ladder = ["Akerselva-fersking","Småkjeltring", "Hasjkjenner", "Forretningsmann","Farlig forbundet", "Narkobaron"];
    var index = 0;
    for (var i=0; i<LEVELS.length; i++) {
        if (status>LEVELS[i]) {
            index += 1;
        }
    }
    return criminal_ladder[index];
}

function dope_origin() {
    var o = ["Nederland", "Sverige", "Danmark", "Tyskland", "Marokko", "Narnia"];
    return o[Math.floor(Math.random()*o.length)];
    }

class Game {

    constructor() {
        
        this.day = 1;
        this.money = 0;
        this.heat = 0;
        this.network = 0;
        this.status = 0;
        this.dept = 0;
        this.workers = [];
        this.inventory = [];
        this.msg = [];
        this.menu = false;
        this.page = false;
        this.flower_msg = talk_with_starters(jensen);
        this.new_hires = this.generate_workers();
        this.new_stash = this.generate_deals();
    }


    hire_worker(worker) {
        this.page = draw_worker_page;
        this.network  += (1 + worker.network);
        this.workers.push(worker);
        this.update_tick();
        this.msg.push(employed_msg(worker.name));
    }

    fire_worker(worker) {
        console.log(worker);
        this.network -= (1 + this.workers[worker].network);
        this.workers.splice(worker, 1);
        console.log("Shit, fire is not implemented");
        this.update_tick();
    }



    view_workers() {
        this.page = draw_worker_page;
    }

    

    get_worker_wishes() {
        var wishes = [];
        for (var i=0; i<this.workers.length; i++) {
            for (var j=0; j<this.workers[i].stash_wishlist.length; j++) {
                wishes.push(this.workers[i].stash_wishlist[j]);
            }
        }
        return wishes;
    }

    update_tick() {
        
        if (this.status < 0 ) {
            this.status += 1;
        }

        

        //NEW DAY NEW DRUGS NEW FUN
        console.log("DEPT: " + this.dept);
        this.day += 1;
        this.menu = false;
        this.msg = [];

        //Remove empty stash
        for (var i=0; i<this.inventory.length; i++) {
            if (this.inventory[i] <= 0) {
                this.inventory.splice(i,1);
                i -= 1;
            }
        }

        //Pay loan interest
        if (this.dept > 0) {
            var interest = Math.floor((this.dept/10)/30);
            this.money -= interest;
            this.msg.push("Betalte " + interest + "kr i renter på lånet");
        }

        var payday = 0;
        for (var i=0; i<this.workers.length; i++) {
            console.log(this.workers[i].cost);
            payday += Math.floor(this.workers[i].cost/30.0);
        }
        if (payday > 0) {
            this.msg.push("Betalte " + payday + "kr i lønninger");
        }
        for (var i=0; i<this.workers.length; i++) {
            this.workers[i].update_tick();
        }
        //Generate new deals
        this.new_stash = this.generate_deals();   

        //Generate flowersms
        if (this.status >= LEVELS[0]) {
            this.flower_msg = talk_with_starters(jensen);
        }   


        //Generate new workers
        this.new_hires = this.generate_workers()       

        
        if (this.heat >= 100) {
            this.status = -365*21;
            this.msg.push("Busted, pass på heaten!");
        }

    }


    heat_trics() {
        //this.flowers();
        this.money -= 10000;
        this.heat -= 30;
        this.msg.push("Jensen har rydda litt, heat redusert");
    }  

    flowers() {
        this.money -= 5000;  
        this.page = flowers_page;
        this.msg.push("Risiko minimert, trygt å handle")
        for (var i=0; i<this.new_stash.length; i++) {
            this.new_stash[i].risk = 0;
        } 
    }


    generate_deals() {
        
        var d = [];
        for (var i=0; i<Math.random()*6; i++) {
            var quantity = (1+Math.floor(Math.random()*(1+(this.status/10))))*100;
            var quality = 7+Math.floor(Math.random()*(20+this.status));
            d.push(new Dope(dope_name(), quantity, quality));

        }
        return d;
    }


    generate_worker() {
        var stability = 1+Math.floor(Math.random()*60+40);
        var skill = 1 +Math.floor((this.status/2)*Math.random()+stability*Math.random());
        var network = 1 + Math.floor(Math.abs(skill-stability)*Math.random());
        var heat = 1+ Math.floor(Math.random()*stability/2+Math.random()*stability/2);
        var cost = Math.floor(skill*100+stability*50+network*100-this.status*100);
        return new Worker(stability, skill, network, heat, cost);
    }

    generate_workers() {
        var w = []
        for (var i=0; i<Math.random()*4; i++) {
            w.push(this.generate_worker());
        }
        return w;
    }

    loan_shark_borrow(amount) {
        this.page = false;
        this.msg.push("Lånte " + amount + " av lånehaien");
        this.dept += amount;   
        this.money += amount;
    }
    
    loan_shark_pay(amount) {
        this.page = false;
        this.msg.push("Betalte " + amount + " til lånehaien");
        this.dept -= amount;   
        this.money -= amount;
    }



    buy(dope, price) {
        this.update_tick();
        this.page = draw_inventory_page;
        if (Math.random()*300 < dope.risk) {
            this.inventory = [];
            this.workers = [];
            this.heat = 100;
            this.status = -365*21;
            this.update_tick();
            this.msg.push("Busted. woops.");
            return;
        }
        this.status += 1;
        this.inventory.push(dope);
        this.money -= price;
        this.heat += Math.floor(this.avg_worker_heat()/10);
        this.msg.push("Kjøpt " + dope.quantity + "g " + dope.name);
    }

    sell(dope, price) {
        this.update_tick();
        this.status += 1;
        this.heat += Math.floor(this.avg_worker_heat()/10);
        this.money += price;
        var index = this.inventory.indexOf(dope);
        this.inventory.splice(index,1);
        if (price < dope.quantity*dope.price ) {
            this.msg.push("Solgt " + dope.quantity + "g " + dope.name + " med " + Math.abs(price-(dope.quantity*dope.price)) + "kr tap");
        }
        else {
            this.msg.push("Solgt " + dope.quantity + "g " + dope.name + " med " + (price-dope.quantity*dope.price) + "kr fortjeneste");
        }
    }

    avg_worker_heat() {
        var avg = 0;
        for (var i=0; i<this.workers.length; i++) {
            avg += this.workers[i].heat;
        }
        avg = avg/this.workers.length;
        return avg;
    }
}


class Worker {

    constructor(stability, skill_level, network, heat,cost) {
        this.name = worker_name();
        this.stability = Math.floor(stability);
        this.skill_level = Math.floor(skill_level);
        this.network = Math.floor(network);
        this.heat = Math.floor(heat);
        this.cost = cost;
        this.inventory = [];
        this.stash_wishlist = [];
        this.calculate_wishlist();       
    }

    calculate_wishlist() {
        this.stash_wishlist = [];
        this.stash_wishlist.push(dope_name());
        for (var i=0; i<Math.random()*2; i++) {
            this.stash_wishlist.push(dope_name());
        }


    }

    update_tick() {
        
        if (Math.random()*100>95) {
            this.calculate_wishlist()
        }

        //Remove empty stash
        for (var i=0; i<this.inventory.length; i++) {
            if (this.inventory[i] <= 0) {
                this.inventory.splice(i,1);
                i -= 1;
            }
        }

        //Calculate selling
        if (this.inventory.length > 0) {
            console.log("AMOUNT" + this.skill_level * Math.random()*this.network);
        }            

       
    }
}


class Dope {

    constructor(name, quantity, quality) {
        this.name = name;
        this.quantity = quantity;
        this.quality = quality;
        this.risk = Math.floor(Math.random()*70)+1;
        this.price =  Math.floor(((110 + quality/3 - this.risk/2 + Math.random()*10) - (quantity/100)*Math.random()*5))  ;
        if (this.price > 120) {
            this.price = 120;

        }
        this.origin = dope_origin();
        this.good_deal = this.get_good_deal();
        this.bad_deal = this.get_bad_deal();
    }



    get_bad_deal() {
        return Math.floor(this.price+Math.random()*10-5)*this.quantity;
    }

    get_good_deal() {
        return 20 + Math.floor(this.price+Math.random()*35)*this.quantity;
    
    }
}



class MenuButton {
    constructor(x,y,w,h,info) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.info = info;
    }

    contains(x,y) {
    
        if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h) {
            return true;
        }
        return false;

    }

}



function generate_menu(the_game) {
    
    
    
    if (the_game.menu) {
        return the_game.menu;
    }
    menu = [];

    if (the_game.status < 0) {
        the_game.page = draw_prison_page;
        menu.push(add_menu_item("Slapp av litt", the_game.update_tick, []));
        menu.push(add_menu_item("Utdann deg til kokk", function() {the_game.update_tick(); the_game.msg.push(food_msg())}, []));
        menu.push(add_menu_item("Start på nytt", function() {game = new Game() }, []));
        return menu;
    }
    if (the_game.dept < 100000) {
        menu.push(add_menu_item("Lån 20.000",  the_game.loan_shark_borrow, [20000]));
    }   
    if (the_game.dept > 0) {
        menu.push(add_menu_item("Betal 10.000 på lån", the_game.loan_shark_pay, [10000] ));
    }
    if (the_game.money > 1) {
        menu.push(add_menu_item("Ansett arbeider", workers_for_hire_menu, [the_game]));
    } 
    if (the_game.workers.length>0) {
        menu.push(add_menu_item("Vis ansatte",the_game.view_workers, []));

        menu.push(add_menu_item("Spark ansatt",fire_menu, [the_game]));
    }
    if (the_game.money > 1 && the_game.network > 0) {
        menu.push(add_menu_item("Kjøp parti", buy_menu, [the_game]));
    }
    var wishes = the_game.get_worker_wishes();
    var deals = 0;
    for (var i=0; i<the_game.inventory.length; i++) {
        if (wishes.includes(the_game.inventory[i].name)) {
            deals += 1;
        
        }
    }
    if (deals > 0) {
        menu.push(add_menu_item("Salgsmuligheter", sell_menu, [the_game]));
    }
    if (the_game.inventory.length>0) {
        menu.push(add_menu_item("Push parti til lavere pris", push_menu, [the_game]));
    }
    if (the_game.status > LEVELS[0] && the_game.money >= 5000) {

        menu.push(add_menu_item("Blomstermelding: 5000kr", the_game.flowers,[]));
    }
    if (the_game.status > LEVELS[0] && the_game.money >= 10000 && the_game.heat > 50) {
        menu.push(add_menu_item("Jensens heat-triks", the_game.heat_trics,[]));
    }
    //the_game.menu = menu;
    return menu;


}
 

//HMMM
function add_menu_item(text, callback, args) {
    return {"text":text, "callback":callback, "args":args};

}

function buy_menu(the_game) {
    the_game.page = draw_new_inventory_page;
    var stash = [];
    for (var i=0; i<the_game.new_stash.length; i++) {
        stash.push(add_menu_item(the_game.new_stash[i].quantity + "g " + the_game.new_stash[i].name + ": " + the_game.new_stash[i].quantity*the_game.new_stash[i].price + "kr",
                    the_game.buy, [the_game.new_stash[i], the_game.new_stash[i].quantity*the_game.new_stash[i].price]));
    }
    stash.push(add_menu_item("Tilbake", function() {the_game.menu = false}));
    the_game.menu = stash;
    return stash;
}


function push_menu(the_game) {
    the_game.page = draw_inventory_page;
    var stash = [];
    var wishlist = the_game.get_worker_wishes();
    for (var i=0; i<the_game.inventory.length; i++) {
        stash.push(add_menu_item("Selg " + the_game.inventory[i].name + " for " + (the_game.inventory[i].bad_deal), the_game.sell, [the_game.inventory[i], the_game.inventory[i].bad_deal]));
    }
    stash.push(add_menu_item("Tilbake", function() {the_game.menu = false}));
    the_game.menu = stash;
}


function sell_menu(the_game) {
    the_game.page = draw_inventory_page;
    var stash = [];
    var wishlist = the_game.get_worker_wishes();
    for (var i=0; i<the_game.inventory.length; i++) {
        if (wishlist.includes(the_game.inventory[i].name)) {
            stash.push(add_menu_item("Selg " + the_game.inventory[i].name + " for " + (the_game.inventory[i].good_deal), the_game.sell, [the_game.inventory[i], the_game.inventory[i].good_deal]));
        }                   
    }
    stash.push(add_menu_item("Tilbake", function() {the_game.menu = false}));
    the_game.menu = stash;
}


function fire_menu(the_game) {
    the_game.page = draw_worker_page;
    var workers = [];
    for (var i=0; i<the_game.workers.length; i++) {
        
        workers.push(add_menu_item("Spark " + the_game.workers[i].name,the_game.fire_worker, [i]));
    }
    workers.push(add_menu_item("Tilbake", function() {the_game.menu = false}));
    the_game.menu = workers;
    return workers;
}


function workers_for_hire_menu(the_game) {
    the_game.page = draw_new_worker_page;
    workers = [];
    for (var i=0; i<the_game.new_hires.length; i++) {

        workers.push(add_menu_item(the_game.new_hires[i].name + ": " + the_game.new_hires[i].cost + "kr/mnd", the_game.hire_worker, [the_game.new_hires[i]]));
    }
    workers.push(add_menu_item("Tilbake", function() {the_game.menu = false}));
    the_game.menu = workers;
    return workers;
}


function draw_stats(the_game) {
    
    ctx.font = "15px Courier";
    ctx.strokeRect(5,5,300,95);
    ctx.strokeText("KR: " + the_game.money, 20, 20);
    ctx.strokeText("DAG: " + the_game.day, 140, 20);
    ctx.strokeText("NETTVERK: " + the_game.network, 20, 40);
    ctx.strokeText("HEAT: " + the_game.heat, 140, 40);
    ctx.strokeText("ANSATTE: " + the_game.workers.length, 20, 60);
    ctx.strokeText("LÅN: " + the_game.dept, 140, 60);
    ctx.strokeText("STATUS: " + status_name(the_game.status), 20, 80);
}


function draw_new_worker_page(the_game) {
    ctx.strokeText("Kandidater: " , PAGE_X,PAGE_Y-20);
    for (var i=0; i<the_game.new_hires.length; i++) {
        ctx.strokeText(the_game.new_hires[i].name, PAGE_X, PAGE_Y+(i*90));      
        ctx.strokeText("Skill: " + the_game.new_hires[i].skill_level + " Nettverk: " + the_game.new_hires[i].network , PAGE_X, PAGE_Y+20+(i*90));      
        ctx.strokeText("Heat: " + the_game.new_hires[i].heat + " Stabilitet: " + the_game.new_hires[i].stability, PAGE_X, PAGE_Y+40+(i*90));
        ctx.strokeText("Ønskeliste: " + the_game.new_hires[i].stash_wishlist , PAGE_X, PAGE_Y+60+(i*90));      
    }
}

function draw_msg(the_game) {
    ctx.font = "15px Courier";
    for (var i=0; i<the_game.msg.length; i++) {

        ctx.strokeText(the_game.msg[the_game.msg.length-i-1], 360, 170+(20*i));
    }
}

function draw_worker_page(the_game) {
    ctx.strokeText("Arbeidere: " , PAGE_X, PAGE_Y-20);
    for (var i=0; i<the_game.workers.length; i++) {
        ctx.strokeText(the_game.workers[i].name + "   Mnds. kostnad: " + the_game.workers[i].cost, PAGE_X, PAGE_Y+(i*90));      
        ctx.strokeText("Skill: " + the_game.workers[i].skill_level + " Nettverk: " + the_game.workers[i].network , PAGE_X, PAGE_Y+20+(i*90));      
        ctx.strokeText("Heat: " + the_game.workers[i].heat + " Stabilitet: " + the_game.workers[i].stability, PAGE_X, PAGE_Y+40+(i*90));
        ctx.strokeText("Ønskeliste: " + the_game.workers[i].stash_wishlist , PAGE_X, PAGE_Y+60+(i*90));      
    }
}



function flowers_page(the_game) {
    ctx.font = "14px Courier";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(PAGE_X,PAGE_Y,750,30);
    ctx.strokeText(the_game.flower_msg , PAGE_X, PAGE_Y+15);
    ctx.drawImage(jens,PAGE_X, PAGE_Y+100);
}

function draw_prison_page(the_game) {
    ctx.font = "14px Courier";
    ctx.fillStyle = "#0000dd";
    ctx.strokeStyle = "#ffffff";
    ctx.fillRect(PAGE_X,PAGE_Y,300,30);
    ctx.strokeText("Dager igjen i buret: " + Math.abs(the_game.status) , PAGE_X+15, PAGE_Y+15);
}
    

function draw_inventory_page(the_game) {
    ctx.strokeText("Lager: " , PAGE_X, PAGE_Y-20);
    for (var i=0; i<the_game.inventory.length; i++) {
        ctx.strokeText(the_game.inventory[i].name, PAGE_X, PAGE_Y+(i*90));      
        ctx.strokeText("Mengde: " + the_game.inventory[i].quantity + "   Betalt (gram/tot): " +  the_game.inventory[i].price + "kr/" + the_game.inventory[i].price*the_game.inventory[i].quantity + "kr"  , PAGE_X, PAGE_Y+20+(i*90));      
        ctx.strokeText("Kvalitet: " + the_game.inventory[i].quality + "% THC   Opprinnelse: " + the_game.inventory[i].origin , PAGE_X, PAGE_Y+40+(i*90));
    }
}

function draw_new_inventory_page(the_game) {
    ctx.strokeText("Til salgs: " , PAGE_X, PAGE_Y-20);
    for (var i=0; i<the_game.new_stash.length; i++) {
        ctx.strokeText(the_game.new_stash[i].name + "  Pris pr gram: " + the_game.new_stash[i].price + "kr",PAGE_X , PAGE_Y+(i*90));      
        ctx.strokeText("Mengde: " + the_game.new_stash[i].quantity + "  Partirisiko: " + the_game.new_stash[i].risk , PAGE_X, PAGE_Y+20+(i*90));      
        ctx.strokeText("Kvalitet: " + the_game.new_stash[i].quality + "% THC   Opprinnelse: " + the_game.new_stash[i].origin , PAGE_X, PAGE_Y+40+(i*90));
    }
}



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var sjapp = new Image(265,320);
sjapp.src = "img/cappelen.png";
var jens = new Image(265,320);
jens.src = "img/jensen.png";
var cop = new Image(480,451);
cop.src = "img/copper.png";
var theme = new Audio("audio/jensen.ogg");
theme.loop = true;
theme.play();

var game = new Game();
var the_menu = [];

function update(game) {
    var menu_items = generate_menu(game);
    the_menu = [];
    for (var i=0; i<menu_items.length; i++) {
        the_menu.push(new MenuButton(5, 100+(45*i), 340, 45, menu_items[i]));
    }   
}
	
function paints() {
    ctx.beginPath();
    ctx.rect(0, 0, X,Y);
    ctx.fillStyle = BACKGROUND;
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.font = "16px Courier";
    ctx.drawImage(jens, 390, 5, 80, 80*jens.height/jens.width);
    if (game.status < 0) {
        ctx.drawImage(cop, 320,20 , 180, 180*cop.height/cop.width);
    }
    ctx.drawImage(sjapp, 305, 5, 80, 80*sjapp.height/sjapp.width);
    for (var i=0; i<the_menu.length; i++) {
        //console.log(menu[i].text);
        ctx.fillStyle = DETAIL;
        ctx.fillRect(the_menu[i].x, the_menu[i].y, the_menu[i].w, the_menu[i].h);
        ctx.strokeRect(the_menu[i].x, the_menu[i].y, the_menu[i].w, the_menu[i].h);
        ctx.strokeText(the_menu[i].info.text, the_menu[i].x+10, the_menu[i].y+18);
    }
    draw_stats(game);
    if (game.page) {
        var swap = PAGE_Y 
        PAGE_Y += the_menu.length*45;
        game.page(game);
        PAGE_Y = swap;
    }
    if  (game.msg.length>0) {
        draw_msg(game);
    }
    ctx.closePath();
    update(game);

    requestAnimationFrame(paints);
}


document.addEventListener("mousedown", mouse_click);


function mouse_click(e) {
    console.log("CLICKY");
    for (var i=0; i<the_menu.length; i++) {
        if (the_menu[i].contains(e.offsetX, e.offsetY)) {
            the_menu[i].info.callback.apply(game, the_menu[i].info.args);
            UPDATE = true;
            return;
        }
    }
}

requestAnimationFrame(paints);


