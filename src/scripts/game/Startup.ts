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
import { DATState } from '../scene/DATState';
import { FlockLeader } from '../test/FlockLeader';

//------------------------------------------------------------------------------------------
export class Startup extends DATState {
	public m_statusMessage:XTextGameObject;
	public script:XTask;

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

		this.script = this.addEmptyTask ();

        var __connectionManager:ConnectionManager = this.world.addGameObject (ConnectionManager, 0, 0.0) as ConnectionManager;
		__connectionManager.afterSetup ([]);
			
		this.createStatusMessage ();

		this.Connect_Script ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
	}
	
//------------------------------------------------------------------------------------------
	public createStatusMessage ():void {
		this.m_statusMessage = this.addGameObjectAsChild (XTextGameObject, 0, 0.0) as XTextGameObject;
		this.m_statusMessage.afterSetup ([]);

		this.m_statusMessage.setupText (
			-1,
			64,
			"",
			"Nunito",
			75,
			0x0000ff,
			true,
			"center", "center"
		);

		this.horizontalPercent (this.m_statusMessage, 0.50);
		this.verticalPercent (this.m_statusMessage, 0.50);
	}

//------------------------------------------------------------------------------------------
	public setStatusMessage (__text:string):void {
		this.m_statusMessage.text = __text;

		this.horizontalPercent (this.m_statusMessage, 0.50);
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
	public Connect_Script ():void {
		this.setStatusMessage ("Connecting to Server...");

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.WAIT1000, 1 * 1000,

					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,

						XTask.FLAGS, (__task:XTask) => {
							__task.ifTrue (ConnectionManager.instance ().isConnected ());
						}, XTask.BNE, "loop",

						() => {
							this.LoginToZone_Script ();
						},

					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
	}

	//------------------------------------------------------------------------------------------
	public LoginToZone_Script ():void {
		this.setStatusMessage ("Logging into Zone...");

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.WAIT1000, 1 * 1000,

					XTask.LABEL, "loop",
						XTask.WAIT, 0x0100,

						XTask.FLAGS, (__task:XTask) => {
							__task.ifTrue (ConnectionManager.instance ().isLoggedIntoZone ());
						}, XTask.BNE, "loop",

						() => {
							this.Connected_Script ();
						},

					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
	}
	
	//------------------------------------------------------------------------------------------
	public Connected_Script ():void {
		this.setStatusMessage ("Logged in!");

		this.script.gotoTask ([
				
			//------------------------------------------------------------------------------------------
			// control
			//------------------------------------------------------------------------------------------
			() => {
				this.script.addTask ([
					XTask.WAIT1000, 1 * 1000,

					() => {
						console.log (": logged in: ", window.location);

						switch (window.location.hash) {
							case "#moderator":
								this.getGameInstance ().gotoState ("CreateRoom");
								break;
							default:
								this.getGameInstance ().gotoState ("JoinRoom");
								break;
						}
					},

					XTask.RETN,
				]);	
			},
				
			//------------------------------------------------------------------------------------------
			// animation
			//------------------------------------------------------------------------------------------	
			XTask.LABEL, "loop",
                XTask.WAIT, 0x0100,
					
				XTask.GOTO, "loop",
				
			XTask.RETN,
				
			//------------------------------------------------------------------------------------------			
		]);
			
	//------------------------------------------------------------------------------------------
	}

//------------------------------------------------------------------------------------------
}