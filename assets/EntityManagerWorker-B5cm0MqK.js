var V=Object.defineProperty;var F=(n,_,y)=>_ in n?V(n,_,{enumerable:!0,configurable:!0,writable:!0,value:y}):n[_]=y;var i=(n,_,y)=>F(n,typeof _!="symbol"?_+"":_,y);(function(){"use strict";class n{constructor(e,t,s,a){i(this,"_id","dump");i(this,"_x",0);i(this,"_y",0);i(this,"_width",80);i(this,"_height",80);i(this,"_speed",5);i(this,"_sprintIncrement",1.4);i(this,"_debugColor","white");i(this,"_type","generic");i(this,"_angle",0);i(this,"_status","freeze");i(this,"_lives",3);i(this,"_attackCountDown",1e3);i(this,"_initialLives",this._lives);i(this,"_regenerationCountDown",1e3*1);i(this,"_lastAttack",-1);i(this,"_lastRegeneration",-1);this._id=n.generateID(),this._x=e||this._x,this._y=t||this._y,this._width=s||this._width,this._height=a||this._height}static generateID(){return"10000000".replace(/[018]/g,e=>(+e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>+e/4).toString(16))}static radToDegreeFixed(e){let t=e*180/Math.PI;return t=t%360,t<0&&(t+=360),t}static calculateAngleFrom(e,t,s=!1){return Math.atan2(e.y-t.y,e.x-t.x)+(s?1.5708:-1.5708)}get id(){return this._id}get x(){return this._x}get y(){return this._y}get center_x(){return this._x+this._width/2}get center_y(){return this._y+this._height/2}get data(){return{id:this._id,x:this._x,y:this._y,width:this._width,height:this._height,color:this._debugColor,type:this._type,canonical_position:{x:this.center_x,y:this.center_y},angle:this._angle,status:this._status,lives:this._lives}}get type(){return this._type}get status(){return this._status}get height(){return this._height}get width(){return this._width}get isAlive(){return this._status!=="dead"}hurt(e){this._lives>0&&this._lives--,this._lives<=0&&(this._status="dead")}relocate(e,t){this._x=e,this._y=t}_move(){this._status==="freeze"||this._status==="dead"||(this._x=this._x+this._speed*(this._status==="running"?this._sprintIncrement:1)*Math.sin(this._angle),this._y=this._y+this._speed*(this._status==="running"?this._sprintIncrement:1)*Math.cos(this._angle-2*(90*Math.PI/180)))}_turn(e,t=!0){this._angle=Math.atan2(this._y-e.y,this._x-e.x)+(t?1.5708:-1.5708)}_positionOfNearestEntity(e){let t=Number.POSITIVE_INFINITY,s=e.reduce((a,r)=>{const p=Math.sqrt(Math.pow(this._x+this._width/2-r.center_x,2)+Math.pow(this._y+this._height/2-r.center_y,2));return p<t&&(t=p),p<(a?Math.sqrt(Math.pow(this._x+this._width/2-a.center_x,2)+Math.pow(this._y+this._height/2-a.center_y,2)):1/0)?r:a},void 0);return s?{distance:t,nearestEntity:s}:{distance:t,nearestEntity:void 0}}_attack(e){const t=Date.now();t-this._lastAttack>this._attackCountDown&&(e.hurt({x:this.x,y:this.y}),this._lastAttack=t)}_isColliding(e){return e?!(this._x+this._width<e._x||this._x>e._x+e._width||this._y+this._height<e._y||this._y>e._y+e._height):!1}_regenerate(){const e=Date.now();e-this._lastRegeneration>this._regenerationCountDown&&this._lives<this._initialLives&&(this._lives++,this._lastRegeneration=e)}}class _ extends n{constructor(t,s,a,r){super();i(this,"_type","bullet");i(this,"_width",24);i(this,"_height",this._width);i(this,"_debugColor","#ff00e8");i(this,"_status","running");i(this,"_initial_x");i(this,"_initial_y");i(this,"_lifeDistance",2e3);i(this,"_speed",10);this._x=t-this._width/2,this._y=s-this._height/2,this._initial_x=this._x,this._initial_y=this._y,this._angle=a,this._speed+=r}move(t){Math.sqrt(Math.pow(this._x+this._width/2-this._initial_x,2)+Math.pow(this._y+this._height/2-this._initial_y,2))>=this._lifeDistance&&(this._status="dead");const{nearestEntity:a}=this._positionOfNearestEntity(t);this._isColliding(a)&&(this._status="dead",this._attack(a)),this._move()}}class y extends n{constructor(){super();i(this,"_debugColor","#49ff00");i(this,"_type","player");i(this,"_x",700);i(this,"_y",200);i(this,"_speed",6);i(this,"_sprintIncrement",1.6);i(this,"_status","freeze");i(this,"_maxBullet",10);i(this,"_bulletsIvoked",[]);i(this,"_lastStatus",this._status);i(this,"_lives",3);i(this,"_width",51);this._lives=this._initialLives}revive(t,s){this._status=this._lastStatus,this._lives=this._initialLives,this._x=t,this._y=s}captureKey(t,s){s=="down"&&t=="KeyW"&&(this._lastStatus="playing"),s=="up"&&t=="KeyW"&&(this._lastStatus="freeze"),t==="ShiftLeft"&&s=="down"&&this._lastStatus==="playing"&&(this._lastStatus="running"),t==="ShiftLeft"&&s=="up"&&this._lastStatus==="running"&&(this._lastStatus="playing"),this.isAlive&&(s=="down"&&t=="KeyW"&&(this._status="playing"),s=="up"&&t=="KeyW"&&(this._status="freeze"),t==="ShiftLeft"&&s=="down"&&this._status==="playing"&&(this._status="running"),t==="ShiftLeft"&&s=="up"&&this._status==="running"&&(this._status="playing"))}calculateAngle(t,s){this._angle=Math.atan2(t.y-(s.y+s.height/2),t.x-(s.x+s.width/2))+1.5708}get bullets(){return this._bulletsIvoked.map(t=>t.data)}shoot(){this._bulletsIvoked.length<this._maxBullet&&this._bulletsIvoked.push(new _(this._x+this._width/2,this._y+this._height/2,this._angle,this._status==="freeze"?0:this.status==="playing"?this._speed:this._speed*this._sprintIncrement))}move(t){this._bulletsIvoked=this._bulletsIvoked.filter(s=>(s.move(t),s.isAlive)),this._move()}get bulletsInstanced(){return this._bulletsIvoked.length}}class g extends n{constructor(){super(...arguments);i(this,"_targetEntity","player");i(this,"_x_center",this._x+this._width/2);i(this,"_y_center",this._y+this._height/2);i(this,"_entityDetectDistance",300);i(this,"_entityDistanceStop",100);i(this,"_status","freeze");i(this,"_calmCountDown",1e3*5);i(this,"_targetRotation",0);i(this,"_lastTimePanicked",-1);i(this,"_isPanicked",!1)}think(t){if(this._status==="dead")return;this._isPanicked=Date.now()-this._lastTimePanicked<this._calmCountDown;const{distance:s,nearestEntity:a}=this._positionOfNearestEntity(t),r=this._isColliding(a);this._isPanicked?this._status="running":s<this._entityDetectDistance&&!r?(this._status="running",this._turn({x:(a==null?void 0:a.x)||0,y:(a==null?void 0:a.y)||0},!1)):r?(this._attack(a),this._status="freeze"):s<=this._entityDistanceStop?this._status="freeze":this._status="iddle",this.iddle(),this._move()}iddle(){this._status==="iddle"&&(Math.abs(this._angle-this._targetRotation)<.009&&(this._targetRotation=g.randomIntFromInterval(-90,90)*(Math.PI/180)+this._angle),this._smoothRotation())}_move(){if(this._isPanicked){this._smoothRotation();const t=this._sprintIncrement;this._sprintIncrement+=this._isPanicked?1:0,super._move(),this._sprintIncrement=t,Math.abs(this._angle-this._targetRotation)<.009&&(this._targetRotation=g.randomIntFromInterval(-90,90)*(Math.PI/180)+this._angle)}else super._move()}_smoothRotation(){this._angle+=(this._targetRotation-this._angle)*.1}static randomIntFromInterval(t,s){return Math.floor(Math.random()*(s-t+1)+t)}hurt(t){super.hurt(),t&&this.status!=="dead"&&this._runAway(t)}_runAway(t){this._lastTimePanicked=Date.now(),this._targetRotation=n.calculateAngleFrom({x:this.x,y:this.y},t,!0),this._status="running"}}class b extends g{constructor(){super(...arguments);i(this,"_debugColor","#fbff00");i(this,"_type","sheep");i(this,"_width",96)}_attack(t){this._regenerate()}}class I extends n{constructor(t,s,a,r){super(t,s,a,r);i(this,"_type","wall");i(this,"_lives",0);i(this,"_debugColor","#3200ff");i(this,"_speed",0);i(this,"_sprintIncrement",1);i(this,"angleToUpperRightCorner");i(this,"angleToUpperLeftCorner");i(this,"angleToLowerRightCorner");i(this,"angleToLowerLeftCorner");const p={x:this.center_x,y:this.center_y},c=n.radToDegreeFixed(n.calculateAngleFrom(p,{x:this._x+this.width,y:this._y}));this.angleToUpperRightCorner=c,this.angleToUpperLeftCorner=360-c,this.angleToLowerRightCorner=180-c,this.angleToLowerLeftCorner=180+c}hurt(){}checkCollision(t){t.forEach(s=>{if(this._isColliding(s)&&s.status!=="freeze"&&s.status!=="dead"){const a=n.radToDegreeFixed(n.calculateAngleFrom({x:this.center_x,y:this.center_y},{x:s.center_x,y:s.center_y})),r=a<this.angleToUpperRightCorner||a>this.angleToUpperLeftCorner,p=a>this.angleToUpperRightCorner&&a<this.angleToLowerRightCorner,c=a>this.angleToLowerRightCorner&&a<this.angleToLowerLeftCorner,f=a>this.angleToLowerLeftCorner&&a<this.angleToUpperLeftCorner;p&&s.x<this.x+this.width&&s.relocate(this.x+this.width,s.y),f&&s.x+s.width>this.x&&s.relocate(this.x-s.width,s.y),r&&s.y+s.height>this.y&&s.relocate(s.x,this.y-s.height),c&&s.y<this.y+this.height&&s.relocate(s.x,this.y+this.height)}})}}class k extends g{constructor(){super(...arguments);i(this,"_debugColor","#ff0000");i(this,"_type","wolf");i(this,"_entityDetectDistance",1e4);i(this,"_width",87)}_runAway(t){}}class S extends g{constructor(){super(...arguments);i(this,"_debugColor","#fbff00");i(this,"_type","cow");i(this,"_width",127);i(this,"_entityDetectDistance",800);i(this,"_speed",4);i(this,"_lives",5);i(this,"_regenerationCountDown",1500)}_attack(t){this._regenerate()}}class C extends g{constructor(){super(...arguments);i(this,"_debugColor","#ff0000");i(this,"_type","rabidWolf");i(this,"_entityDetectDistance",500);i(this,"_speed",6);i(this,"_width",106);i(this,"_lives",4);i(this,"_calmCountDown",500);i(this,"_attackCountDown",500)}}class o{constructor(){i(this,"_sheepList",[]);i(this,"_wolves",[]);i(this,"_obstacules",[]);i(this,"_player");i(this,"_activeBackground",[]);i(this,"_inactiveBackground",[]);i(this,"_playerSpawner",{x:0,y:0,width:0,height:0});i(this,"_enemySpawner",{x:0,y:0,width:0,height:0});i(this,"_animalSpawner",{x:0,y:0,width:0,height:0});console.info("🎭 Initializing the entity manager"),this._player=new y}loadMap(e){if(console.info("🔨 Building a map"),e.obstacles.length<=0||!e.spawner.animals||!e.spawner.enemies||!e.spawner.player)return console.warn(`Apparently your map is not valid.
Please check that you have declared an spawn point for animals, enemies and players and at least one obstacle.`),!1;for(let t of e.backgroundActive)this._activeBackground.push({id:"",x:t.x,y:t.y,width:t.width,height:t.height,color:"purple",type:"backgroundActive",canonical_position:{x:t.x+t.width/2,y:t.y+t.height/2},angle:0,status:"freeze",bullets:void 0,lives:0});for(let t of e.backgroundInactive)this._inactiveBackground.push({id:"",x:t.x,y:t.y,width:t.width,height:t.height,color:"purple",type:"backgroundInactive",canonical_position:{x:t.x+t.width/2,y:t.y+t.height/2},angle:0,status:"freeze",bullets:void 0,lives:0});return e.obstacles.forEach(t=>{this._obstacules.push(new I(t.x,t.y,t.width,t.height))}),this._playerSpawner={x:e.spawner.player.x,y:e.spawner.player.y,width:e.spawner.player.width,height:e.spawner.player.height},this._animalSpawner={x:e.spawner.animals.x,y:e.spawner.animals.y,width:e.spawner.animals.width,height:e.spawner.animals.height},this._enemySpawner={x:e.spawner.enemies.x,y:e.spawner.enemies.y,width:e.spawner.enemies.width,height:e.spawner.enemies.height},this._player.relocate(o.randomIntFromInterval(this._playerSpawner.x,this._playerSpawner.x+this._playerSpawner.width-this._player.width),o.randomIntFromInterval(this._playerSpawner.y,this._playerSpawner.y+this._playerSpawner.height-this._player.height)),!0}static randomIntFromInterval(e,t){return Math.floor(Math.random()*(t-e+1)+e)}static async readMapFromSVG(e){console.info("🗺️ Reading map");const t={obstacles:[],spawner:{},backgroundActive:[],backgroundInactive:[]};if(typeof Document>"u")return console.warn("Oops! If you are using this method inside a Web Worker, it will not work :( Please run it from the main thread and send the event response to the instantiated class of your Web Worker :D"),t;try{const a=await(await fetch(e)).text(),c=new DOMParser().parseFromString(a,"image/svg+xml").querySelectorAll("g");for(let f of c){const v=f.getAttribute("inkscape:label");v==="Background"&&f.querySelectorAll("rect").forEach(h=>{h.getAttribute("inkscape:label")==="Active"?t.backgroundActive.push({x:h.x.baseVal.value,y:h.y.baseVal.value,width:h.width.baseVal.value,height:h.height.baseVal.value}):h.getAttribute("inkscape:label")==="Inactive"&&t.backgroundInactive.push({x:h.x.baseVal.value,y:h.y.baseVal.value,width:h.width.baseVal.value,height:h.height.baseVal.value})}),v==="Walls"&&f.querySelectorAll("rect").forEach(h=>{let d=!1;if(h.transform.baseVal.length>0){let L=h.transform.baseVal.length;for(let m=0;m<L;m++){const w=h.transform.baseVal.getItem(m);w.type===4&&(console.log(w.angle),d=w.angle>45&&w.angle<135||w.angle<-45&&w.angle>-135)}}t.obstacles.push({x:h.x.baseVal.value,y:h.y.baseVal.value,width:d?h.height.baseVal.value:h.width.baseVal.value,height:d?h.width.baseVal.value:h.height.baseVal.value})}),v==="Spawner"&&f.querySelectorAll("rect").forEach(h=>{const d=h.getAttribute("inkscape:label");d==="Player"&&(t.spawner.player={x:h.x.baseVal.value,y:h.y.baseVal.value,width:h.width.baseVal.value,height:h.height.baseVal.value}),d==="Enemies"&&(t.spawner.enemies={x:h.x.baseVal.value,y:h.y.baseVal.value,width:h.width.baseVal.value,height:h.height.baseVal.value}),d==="Animals"&&(t.spawner.animals={x:h.x.baseVal.value,y:h.y.baseVal.value,width:h.width.baseVal.value,height:h.height.baseVal.value})})}return t}catch(s){return console.error("Error al cargar el SVG:",s),t}}bulkInvoke(e){let t=!0;for(let s=0;s<e.length;s++){let a=this._invoke(e[s]);t=t&&a}return t}clearAllEntities(){this._sheepList=[],this._wolves=[]}_invoke(e){if(e.amount<=0)return!1;if(e.type=="sheep"||e.type=="cow"){e.clearQueue&&(this._sheepList=[]);for(let t=0;t<e.amount;t++){const s=e.type==="sheep"?new b:new S;s.relocate(o.randomIntFromInterval(this._animalSpawner.x,this._animalSpawner.x+this._animalSpawner.width-s.width),o.randomIntFromInterval(this._animalSpawner.y,this._animalSpawner.y+this._animalSpawner.height-s.height)),this._sheepList.push(s)}return!0}if(e.type=="wolf"||e.type=="rabidWolf"){e.clearQueue&&(this._wolves=[]);for(let t=0;t<e.amount;t++){const s=e.type==="wolf"?new k:new C;s.relocate(o.randomIntFromInterval(this._enemySpawner.x,this._enemySpawner.x+this._enemySpawner.width-s.width),o.randomIntFromInterval(this._enemySpawner.y,this._enemySpawner.y+this._enemySpawner.height-s.height)),this._wolves.push(s)}return!0}return console.warn(`It was not possible to invoke an entity of the type ${e.type}.`),!1}get data(){return[...this._inactiveBackground,...this._activeBackground,...this._obstacules.map(e=>e.data),...this._wolves.map(e=>e.data),...this._sheepList.map(e=>e.data),...this._player.bullets,this._player.data]}get size(){return this._sheepList.length+this._wolves.length+(this._player?1+this._player.bulletsInstanced:0)+this._obstacules.length}followCursorPlayer(e,t){this._player.calculateAngle(e,t)}captureKey(e,t){this._player.captureKey(e,t)}step(){return this._player.isAlive||this._player.revive(o.randomIntFromInterval(this._playerSpawner.x,this._playerSpawner.x+this._playerSpawner.width-this._player.width),o.randomIntFromInterval(this._playerSpawner.y,this._playerSpawner.y+this._playerSpawner.height-this._player.height)),this._player.move([...this._wolves,...this._obstacules]),this._sheepList=this._sheepList.filter(e=>(e.think([this._player]),e.isAlive)),this._wolves=this._wolves.filter(e=>(e.type==="wolf"?e.think(this._sheepList):e.think([...this._sheepList,this._player]),e.isAlive)),this._obstacules.forEach(e=>e.checkCollision([...this._wolves,...this._sheepList,this._player])),{animalsAlive:this._sheepList.length,enemiesAlive:this._wolves.length,isPlayerAlive:this._player.isAlive}}spawnBullet(){this._player.shoot()}}function D(l,e=30){const t=1e3/e;setInterval(l,t)}console.info("⚙️ Entity Manager Worker Up");const u=new o;self.onmessage=l=>{const{type:e,params:t}=l.data;e==="mousemove"&&u.followCursorPlayer(t[0],t[1]),e==="key"&&u.captureKey(t[0],t[1]),e==="click"&&u.spawnBullet(),e==="loadmap"&&u.loadMap(t[0]),e==="bulkInvoke"&&(u.bulkInvoke(t[0]),self.postMessage({type:"invoked",params:[]})),e==="clear"&&u.clearAllEntities()};function A(){const l=u.step();self.postMessage({type:"tick",params:[u.data,u.size,l]})}D(A,60)})();