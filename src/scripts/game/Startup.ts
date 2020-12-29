//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
import { world } from '../app';
import { XTask } from '../../engine/task/XTask';
import { XTaskManager} from '../../engine/task/XTaskManager';
import { XTaskSubManager} from '../../engine/task/XTaskSubManager';
import { XWorld} from '../../engine/sprite/XWorld';
import { XGameObject} from '../../engine/gameobject/XGameObject';
import { XState } from '../../engine/state/XState';
import { GUID } from '../../engine/utils/GUID';
import { XSimpleXMLNode } from '../../engine/xml/XSimpleXMLNode';
import * as SFS2X from "sfs2x-api";
import { SFSManager } from '../../engine/sfs/SFSManager';
import { XSpriteButton } from '../../engine/ui/XSpriteButton';
import { XTextButton } from '../../engine/ui/XTextButton';
import { XTextSpriteButton } from '../../engine/ui/XTextSpriteButton';
import { XTextGameObject } from '../../engine/ui/XTextGameObject';
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { TextInput } from 'pixi-textinput-v5';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { FlockLeader } from '../test/FlockLeader';

//------------------------------------------------------------------------------------------
export class Startup extends XState {
	public m_statusMessage:XTextGameObject;
	public m_resizeListenerID:number;

//------------------------------------------------------------------------------------------	
	constructor () {
		super ();
	}
	
//------------------------------------------------------------------------------------------
	public setup (__world:XWorld, __layer:number, __depth:number):XGameObject {
        super.setup (__world, __layer, __depth);

		return this;
	}
	
//------------------------------------------------------------------------------------------
	public afterSetup (__params:Array<any> = null):XGameObject {
        super.afterSetup (__params);

		console.log (": guid: ", GUID.create ());

		var __leader:FlockLeader = world.addGameObject (FlockLeader, 0, 0.0, false) as FlockLeader;
		__leader.afterSetup ([]);

        var __gameObject:ConnectionManager = this.world.addGameObject (ConnectionManager, 0, 0.0) as ConnectionManager;
		__gameObject.afterSetup ([]);

		this.createBitmapFont (
			"Nunito",
			{
				fontFamily: "Nunito",
				fontSize: 60,
				strokeThickness: 0,
				fill: "0xffffff",         
			},
			{chars: this.getBitmapFontChars ()}
		);
			
		this.m_statusMessage = this.addGameObjectAsChild (XTextGameObject, 0, 0.0) as XTextGameObject;
		this.m_statusMessage.afterSetup ([]);

		this.m_statusMessage.setupText (
			500,
			64,
			"hello world",
			"Nunito",
			100,
			0xff0000,
			true,
			"center", "center"
		);

		this.horizontalPercent (this.m_statusMessage, 0.50);
		this.verticalPercent (this.m_statusMessage, 1.0);

		this.m_resizeListenerID = this.m_XApp.addWindowResizeListener (this.resize.bind (this));
		this.resize ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
		
		this.m_XApp.removeWindowResizeListener (this.m_resizeListenerID);
	}
	
//------------------------------------------------------------------------------------------
	public resize ():void {
		this.m_XApp.getRenderer ().resize (this.m_XApp.getWindowWidth (), this.m_XApp.getWindowHeight ());

		//------------------------------------------------------------------------------------------
		// scale the entire stage
		//------------------------------------------------------------------------------------------		
		this.m_XApp.getStage ().scale.x = 1.0;
		this.m_XApp.getStage ().scale.y = 1.0;

		var i:number;

		for (i=0; i<XWorld.MAX_LAYERS; i++) {
			var __x:number = 0;
			var __y:number = 0;
	
			var __screenWidth:number = this.m_XApp.getScreenWidth ();
			var __screenHeight:number = this.m_XApp.getScreenHeight ();
	
			var __scaleX:number = this.m_XApp.getCanvasWidth () / __screenWidth;
			var __scaleY:number = this.m_XApp.getCanvasHeight () / __screenHeight;
	
			var __scaleRatio:number = Math.max (__scaleX, __scaleY);
				
			__x = (this.m_XApp.getCanvasWidth () - __screenWidth * __scaleRatio) / 2;
			__y = (this.m_XApp.getCanvasHeight () - __screenHeight * __scaleRatio) / 2;

			this.scaleLayer (i, __x, __scaleRatio, __y, __scaleRatio);
		}
	}

//------------------------------------------------------------------------------------------
	public scaleLayer (__layerNum:number, __x:number, __scaleX:number, __y:number, __scaleY:number):void {
		var __layer:XSpriteLayer = this.world.getLayer (__layerNum);

		__layer.x = __x;
		__layer.y = __y;
		__layer.scale.x = __scaleX * G.scaleRatio;
		__layer.scale.y = __scaleY * G.scaleRatio;
	}

//------------------------------------------------------------------------------------------
	public getActualWidth ():number {
		return G.SCREEN_WIDTH;
	}

//------------------------------------------------------------------------------------------
	public getActualHeight ():number {
		return G.SCREEN_HEIGHT;
	}

//------------------------------------------------------------------------------------------
}