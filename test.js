//constは再宣言再代入禁止、letは再宣言禁止のみ
const CHRHEIGHT = 9;               //キャラの高さ
const CHRWIDTH = 8;                //キャラの幅
const INTERVAL = 33;               //フレーム呼び出し感覚、フレームレート、およそ30FPS
const WIDTH = 120;                 //マップの幅
const HEIGHT = 128;                //マップの高さ
const SCROLL = 1;
const SMOOTH = 0;                  //ドット補完処理のスイッチ
const TILESIZE = 8;                //マップ画像のタイルサイズ(仮)
const TILECOLUMN = 4;              //タイル縦の列
const TILEROW = 4;                 //タイル横の列
const MAP_HEIGHT = 32;             //マップの高さ、32マスの長さ
const MAP_WIDTH = 32;              //マップの幅、32マスの長さ
const SCR_HEIGHT = 8;              //画面タイルサイズの半分の高さ
const SCR_WIDTH = 8;               //画面タイルサイズの半分の幅
const START_X = 0;                 //プレイヤーの初期位置X
const START_Y = 0;　　　　　　　　　　//プレイヤーの初期位置Y

const gKey = new Uint8Array(0x100);

let gAngle = 0;                    //プレイヤーの向き
let gFrame = 0;                    //内部カウンタ
let gScreen;                       //仮想画面
let gImgMap;                       //マップのための画像
let gImgPlayer;                    //プレイヤー画像
let gImfInside;                    //マップのための画像２
let gWidth;                        //実画面の幅
let gHeight;                       //実画面の高さ
let gPhase = 0;                    //探検や戦闘などのフェイズ切り替えに用いる
let gPlayerX = START_X * TILESIZE  + TILESIZE / 2;//TILESIZE/2によってタイルの真ん中に位置調整している
let gPlayerY = START_Y * TILESIZE  + TILESIZE / 2;//上に同じ
let gMoveX = 0;
let gMoveY = 0;
let gMessage1 = null;

//画像フォルダから画像の格納
const gFileMap = "img/tile1.png";
const gFileInside = "img/map.png";
const gFilePlayer = "img/girl.png";



const gMap = [
    8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 14,
 12, 13, 14, 14, 11, 10, 10, 11, 11, 10, 10, 10, 11, 11, 11, 10, 11, 10, 10, 10, 10, 10, 11, 10, 10, 11, 10, 10, 10, 10, 10, 10,
 10, 10, 10, 11, 11, 10, 11, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
 10, 10, 10, 14, 14, 15, 15, 14, 15, 11, 11, 15, 11, 10, 10, 14, 14, 15, 14, 10, 15, 11, 15, 11, 10, 10, 10, 14, 14, 15, 15, 14,
 10, 10, 11, 11, 11, 10, 10, 11, 10, 10, 11, 10, 11, 10, 15, 15, 15, 14, 14, 15, 10, 10, 10, 11, 10, 10, 10, 11, 14, 10, 10, 10,
 1, 1, 0, 0, 0, 1, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
 0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
 0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3, 9, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
 0, 0, 0, 0, 8, 9, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
 0, 0, 0, 0, 12, 13, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
 7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];


function DrawMap(g)//マップの描画のための
{
    let mx = Math.floor(gPlayerX/TILESIZE);          //プレイヤーのタイル座標X、現在座標X
    let my = Math.floor(gPlayerY/TILESIZE);          //プレイヤーのタイル座標Y、現在座標Y
    
    for( let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++) {//-8から-7,-6,-5と8まで加算することで16のyの並びを表現している
        let ty = my + dy;　　　　　　　　　　　　　　　　　　 //tyは現在y座標
        let py = ( ty + MAP_HEIGHT ) % MAP_HEIGHT;      //現在座標tyにマップの高さである32を掛け、余剰を出す
        
        for ( let dx = -SCR_HEIGHT; dx <= SCR_WIDTH; dx++) {
            let tx = mx + dx;
            let px = ( tx + MAP_WIDTH ) % MAP_WIDTH;
            DrawTile(g, tx * TILESIZE + WIDTH / 2 - gPlayerX, ty * TILESIZE + HEIGHT / 2 - gPlayerY, gMap[ py * MAP_WIDTH + px ]);
        }
    }
    
    g.drawImage(gImgPlayer,                       
                (gFrame >> 3 & 1) * CHRWIDTH,         //よくわからない
                gAngle * CHRHEIGHT,
                CHRWIDTH, CHRHEIGHT,
                WIDTH/2 - CHRWIDTH /2,                //WIDTH/2でキャラクターを画面幅の真ん中に 
                HEIGHT / 2 - CHRHEIGHT + TILESIZE / 2,//HEIGHT/2でキャラクターを画面高さの真ん中に
                CHRWIDTH, CHRHEIGHT
               );
}


function DrawMain()
{
    const g = gScreen.getContext("2d");//仮想画面の2D描画コンテキスト取得
    
    if (gPhase == 0){                  //一概に、戦闘状態でないときマップを描画する
        DrawMap( g ); 
    }else{                             //戦闘状態のとき戦闘画面を描画する
        DrawFight( g );
    }
    
    
}


function DrawTile( g, x, y, idx )
{
    const ix = ( idx % TILECOLUMN ) * TILESIZE;
    const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
    
    g.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}


function LoadImage()                          //画像フォルダから使用する画像の読み込み
{
 gImgMap = new Image(); gImgMap.src = gFileMap;//タイル画像読み込み
 gImgInside = new Image(); gImgInside.src = gFileInside;//タイル2画像読み込み
 gImgPlayer = new Image(); gImgPlayer.src = gFilePlayer;
}


function Sign(val)
{
    if( val==0 ) {
        return(0);
    }
    if(val < 0){
        return(-1);
    }
    return (1);
}


function TickField()
{
    if (gMoveX != 0 || gMoveY != 0 || gMessage1){}
    else if(gKey[37]) { gAngle = 1; gMoveX = -TILESIZE;}         //左#キーコード参照
    else if(gKey[38]) { gAngle = 3; gMoveY= -TILESIZE;}         //上#キーコード参照
    else if(gKey[39]) { gAngle = 2; gMoveX = TILESIZE;}          //右#キーコード参照x座標をTILESIZE分+することで移動となる
    else if(gKey[40]) { gAngle = 0; gMoveY = TILESIZE;}          //下#キーコード参照
    
    let mx = Math.floor( (gPlayerX + gMoveX) / TILESIZE);        //gMoveはプレイヤーの移動量
    let my = Math.floor( (gPlayerY + gMoveY) / TILESIZE);
    mx += MAP_WIDTH;
    mx %= MAP_WIDTH;
    my += MAP_HEIGHT;
    my %= MAP_HEIGHT;
    let m = gMap[ my * MAP_WIDTH + mx ];
    
    
    
    //Math.signだった箇所
    gPlayerX += Sign(gMoveX) * SCROLL;//プレイヤー座標移動X
    gPlayerY += Sign(gMoveY) * SCROLL;//プレイヤー座標移動Y
    gMoveX -= Sign(gMoveX) * SCROLL;//移動量消費X
    gMoveY -= Sign(gMoveY) * SCROLL;//移動量消費Y
    
    //マップループ処理
    gPlayerX += (MAP_WIDTH * TILESIZE);//これらのgPlayerXとYがDrawMain()のキャラクター描画に反映される
    gPlayerX %= (MAP_WIDTH * TILESIZE);
    gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);
    
}


function WmPaint()
{
    DrawMain();
    
    const ca = document.getElementById("main");
    const g = ca.getContext("2d");
    
     g.drawImage(gScreen, 0, 0, 
                gScreen.width, 
                gScreen.height, 
                0, 0, gWidth, gHeight);
}

function WmSize()//ブラウザ画面サイズの設定
{   
    const ca = document.getElementById("main");//html上のキャンバス要素を取得
    ca.height = window.innerHeight;            //キャンバスの高さをブラウザの高さに変更
    ca.width = window.innerWidth;              //キャンバスの幅をブラウザの幅に変更
    
    const g = ca.getContext("2d");             //canvas要素を2d画用紙として扱う
    //2dを渡して実行すると、2Dグラフィックを描画するためのメソッドやプロパティをもつオブジェクトを返す。
    
    
    //画像が滑らか（true：既定値）か、またはそうではない（false）かによって、変化するように設定できます
    //実画面サイズを計測。ドットのアスペクト比を維持したままでの最大サイズを計測
    g.imageSmoothingEnabled = g.msImageSmoothEnabled = SMOOTH;
    
    //実画面、現在の画面状況による幅と高さ
    gWidth = ca.width;
    gHeight = ca.height;
    if(gWidth / WIDTH < gHeight / HEIGHT) {
        gHeight = gWidth * HEIGHT / WIDTH;
    }else{
        gWidth = gHeight * WIDTH / HEIGHT;
    }
}


function WmTimer()
{
    gFrame++;
    TickField();
    WmPaint();
}
    
    
window.onkeyup = function(ev)   //キーから指を離したとき
{
    gKey[ ev.keyCode ] = 0;
}
    
    
window.onkeydown = function(ev)//キーを押し込んだ時のイベント
{
    let c = ev.keyCode;
    
    if(gKey[ c ] = 0){          //キーを押下中の時(キーリピート)
        return;
    }
    gKey[ c ] = 1;
    
    if(gPhase == 1){
        gPhase = 0;
        
    }
    gMessage1 = null;
}
    

//ブラウザ起動イベント
window.onload = function()
{
    LoadImage();                                          //使用する画像をフォルダから読み込み
    
    gScreen = document.createElement("canvas");           //html上のcanvas空間を取得。仮想画面とする
    gScreen.width = WIDTH;                                //仮想画面の幅を設定
    gScreen.height = HEIGHT;              　　　　　　　　　 //仮想画面の高さを設定
    
    WmSize();                                             //画面サイズの初期化
    window.addEventListener("resize", function() { WmSize() });//resizeイベントはブラウザサイズ変更時に実行されるという意味、WmSize()がよばれる
    setInterval( function() { WmTimer() }, INTERVAL);//INTERVAL=33なので33ミリ秒ごとにWmTimer()が実行される、これで画像描画を成立させる
}