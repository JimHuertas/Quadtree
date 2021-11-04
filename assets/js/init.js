

/*****************************************/
/**********Graphing Quadtree**************/
/*****************************************/


function show(qtree, graphics){
    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.beginFill(0x5A8643);
    graphics.drawRect(qtree.bounder(0), qtree.bounder(1), qtree.bounder(2), qtree.bounder(3));
    //graphics.drawRect(width/2-qt.boundary.x, heightWindow/2-qt.boundary.y, qt.boundary.w, qt.boundary.h);
    if(qtree.divided == true){
        show(qtree.northWest, graphics);
        show(qtree.northEast, graphics);
        show(qtree.southEast, graphics);
        show(qtree.southWest, graphics);
    }
}

function show_puntos(qt,puntos){
    for(i=0; i<qt.points.length; i++){
        puntos.drawCircle(position_x+qt.points[i].x-1.5, position_y+qt.points[i].y-1.5, 3);
    }
    if(qt.divided){
        show_puntos(qt.northWest, puntos);
        show_puntos(qt.northEast, puntos);
        show_puntos(qt.southEast, puntos);
        show_puntos(qt.southWest, puntos);
    }
}
var heightWindow = window.innerHeight-20;
var width = window.innerWidth-20;
position_x = width/2+400;
position_y = heightWindow/2+400;  
function init(qt){
    heightWindow = window.innerHeight-20;
    width = window.innerWidth-20;
    console.log(qt);
    const app = new PIXI.Application({
        width: window.innerWidth-20, 
        height: window.innerHeight-20,
        background: 0x272D37,
        resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(app.view);
    app.renderer.backgroundColor = 0x000000;

    //GRAFICAR UN TITULO
    app.loader
    .add('desyrel', '/assets/fonts/desyrel.xml')
    .load(onAssetsLoaded);
    function onAssetsLoaded() {
        const bitmapFontText = new PIXI.BitmapText('QuadTree',
        { 
            fontName: 'Desyrel',
            fontSize: 55, 
            align: 'center' 
        });
        bitmapFontText.x = width/2-150;
        bitmapFontText.y = 8;
    
        app.stage.addChild(bitmapFontText);
    }

    const container = new PIXI.Container();
    app.stage.addChild(container);

    container.x = app.screen.width / 2;
    container.y = app.screen.height / 2;
    container.background = 0x272D37;


    //GRAFICAS PARA QUEADTREE
    const graphics = new PIXI.Graphics();
    position_x = width/2-400;
    position_y = heightWindow/2-400;


    graphics.lineStyle(2, 0xFFFFFF, 1);
    graphics.beginFill(0x000000);
    graphics.drawRect(position_x, position_y, 800, 800);
    //show(qt, graphics);

    const puntos = new PIXI.Graphics();
    puntos.beginFill(0xFF0000);
    puntos.drawCircle(position_x+10-1.5, position_y+10-1.5, 3);
    //show_puntos(qt, puntos);
    puntos.endFill();
    graphics.addChild(puntos);
    graphics.endFill();
    app.stage.addChild(graphics);
    //console.log(qt);
}
