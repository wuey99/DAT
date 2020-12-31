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
import { TextInput } from 'pixi-textinput-v5';
import { ConnectionManager } from '../sfs/ConnectionManager';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';
import { DATState } from '../scene/DATState';
import { HBox } from '../../engine/ui/HBox';
import { XJustify } from '../../engine/ui/XJustify';
import { FlockLeader } from '../test/FlockLeader';

//------------------------------------------------------------------------------------------
export class CreateRoom extends DATState {
	public m_roomTextInput:TextInput;
	public m_createRoomButton:XTextSpriteButton;

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
	
		this.setupUI ();

		return this;
	}

//------------------------------------------------------------------------------------------
	public cleanup ():void {
        super.cleanup ();
	}
	
//------------------------------------------------------------------------------------------
	public setupUI ():void {
		var __ypercent:number = 0.25;

		var __hbox:HBox = this.addGameObjectAsChild (HBox, 0, 0.0, false) as HBox;
		__hbox.afterSetup ([100, 100, XJustify.SPACE_EVENLY]);
	
		var __roomLabel:XTextSprite = this.createXTextSprite (
			-1,
			-1,
			"Enter name of room to create",
			"Nunito",
			25,
			0x000000,
			true,
			"center", "center"
		);
		this.addSortableChild (__roomLabel, 0, 0.0, false);
		this.horizontalPercent (__roomLabel, 0.33);
		this.verticalPercent (__roomLabel, __ypercent);

		var __textInput:TextInput = this.m_roomTextInput = new TextInput (
			{
				input: {fontSize: '25px'}, 
				box: {fill: 0xc0c0c0},
			}
		);
		this.addSortableChild (__textInput, 0, 0.0, false);
		this.horizontalPercent (__textInput, 0.50);
		this.verticalPercent (__textInput, __ypercent);

		var __createButton:XTextSpriteButton = this.m_createRoomButton = this.addGameObjectAsChild (XTextSpriteButton, 0, 0.0, false) as XTextSpriteButton;
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
		this.addSortableChild (__createButton, 0, 0.0, false);
		this.horizontalPercent (__createButton, 0.66);
		this.verticalPercent (__createButton, __ypercent);
	}

//------------------------------------------------------------------------------------------
}