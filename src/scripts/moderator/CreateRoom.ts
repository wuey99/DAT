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
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { XTextGameObject } from '../../engine/ui/XTextGameObject';
import { TextInput } from 'pixi-textinput-v5';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { DATState } from '../scene/DATState';
import { HBox } from '../../engine/ui/HBox';
import { VBox } from '../../engine/ui/VBox';
import { XJustify } from '../../engine/ui/XJustify';
import { FlockLeader } from '../test/FlockLeader';

//------------------------------------------------------------------------------------------
export class CreateRoom extends DATState {
	public m_statusMessage:XTextGameObject;
	public m_createRoomButton:XTextSpriteButton;
	public m_mainUI:HBox;

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
	
		this.createStatusMessage ();

		this.setupUI ();

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
		this.verticalPercent (this.m_statusMessage, 0.125);
	}

	//------------------------------------------------------------------------------------------
	public setStatusMessage (__text:string):void {
		this.m_statusMessage.text = __text;

		this.horizontalPercent (this.m_statusMessage, 0.50);
	}

//------------------------------------------------------------------------------------------
	public createRoom ():void {
		var __roomID:string = GUID.create ().substring (1, 18);

		var __settings:SFS2X.RoomSettings = new SFS2X.RoomSettings (__roomID);
		__settings.maxUsers = 6;
		__settings.groupId = "default";

		SFSManager.instance ().once (SFS2X.SFSEvent.ROOM_ADD, (e:SFS2X.SFSEvent) => {
			console.log (": onRoomAdded: ", e);

			this.m_mainUI.nukeLater ();

			this.showRoomID (__roomID);
		});

		SFSManager.instance ().once (SFS2X.SFSEvent.ROOM_CREATION_ERROR, (e:SFS2X.SFSEvent) => {
			console.log (": onRoomCreationError: ", e);
		});

		SFSManager.instance ().send (new SFS2X.CreateRoomRequest (__settings));
	}

//------------------------------------------------------------------------------------------
	public showRoomID (__roomID:string):void {
		this.setStatusMessage ("Room ID: ");

		var __hbox:HBox = this.addGameObjectAsChild (HBox, 0, 0.0, false) as HBox;
		__hbox.afterSetup ([400, 100, XJustify.CENTER]);

		var __roomIDText:any = new TextInput (
			{
				input: {
					fontSize: '40px'
				}, 
				box: {fill: 0xc0c0c0},
			}
		);

		__roomIDText.text = __roomID;

		__hbox.addItem (__roomIDText);
		__hbox.addSortableChild (__roomIDText, 0, 0.0, false);

		this.horizontalPercent (__hbox, 0.50);
		this.verticalPercent (__hbox, 0.50);
	}

//------------------------------------------------------------------------------------------
	public setupUI ():void {
		this.setStatusMessage ("Create Room");

		var __ypercent:number = 0.50;

		var __hbox:HBox = this.m_mainUI = this.addGameObjectAsChild (HBox, 0, 0.0, false) as HBox;
		__hbox.afterSetup ([400, 100, XJustify.SPACE_BETWEEN]);

		var __vbox:VBox = __hbox.addGameObjectAsChild (VBox, 0, 0.0, false) as VBox;
		__vbox.afterSetup ([250, 60, XJustify.CENTER]);

		var __roomLabel:XTextSprite = this.createXTextSprite (
			-1,
			-1,
			"Create a new Room",
			"Nunito",
			25,
			0x000000,
			true,
			"center", "center"
		);

		__vbox.addItem (__roomLabel);
		__vbox.addSortableChild (__roomLabel, 0, 0.0, false);
		
		__hbox.addItem (__vbox);
		__hbox.addSortableChild (__vbox, 0, 0.0, false);

		var __createButton:XTextSpriteButton = this.m_createRoomButton = __hbox.addGameObjectAsChild (XTextSpriteButton, 0, 0.0, false) as XTextSpriteButton;
		__createButton.afterSetup ([
			"StandardButton",
			true, 10, 150, 60,
			"CREATE",
			"Nunito",
			25,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			0x000000,
			false,
			"center", "center"
		]);
		__hbox.addItem (__createButton);

		this.horizontalPercent (__hbox, 0.50);
		this.verticalPercent (__hbox, __ypercent);

		this.m_createRoomButton.addMouseUpListener (() => {
			console.log (": mouse up: ");

			this.m_createRoomButton.setDisabled (true);

			this.createRoom ();
		});
	}

//------------------------------------------------------------------------------------------
}