//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy'
import { XApp } from '../../engine/app/XApp';
import { XSprite } from '../../engine/sprite/XSprite';
import { XSpriteLayer } from '../../engine/sprite/XSpriteLayer';
import { XSignal } from '../../engine/signals/XSignal';
import { XSignalManager } from '../../engine/signals/XSignalManager';
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
import { XButton } from '../../engine/ui/XButton';
import { XSpriteButton } from '../../engine/ui/XSpriteButton';
import { XTextButton } from '../../engine/ui/XTextButton';
import { XTextSpriteButton } from '../../engine/ui/XTextSpriteButton';
import { XTextGameObject } from '../../engine/ui/XTextGameObject';
import { XTextSprite } from '../../engine/sprite/XTextSprite';
import { Box } from '../ui/Box';
import { HBox } from '../ui/HBox';
import { VBox } from '../../engine/ui/VBox';
import { XJustify } from '../ui/XJustify';
import { Spacer } from '../ui/Spacer';
import { XType } from '../../engine/type/XType';
import { G } from '../../engine/app/G';

//------------------------------------------------------------------------------------------
export class XMLBox extends Box {
	public script:XTask;

	public m_xml:XSimpleXMLNode;

	public static VBox:string = "VBox";
	public static HBox:string = "HBox";
	public static SpriteButton:string = "SpriteButton";
	public static TextSpriteButton:string = "TextSpriteButton";
	public static TextButton:string = "TextButton";
	public static Spacer:string = "Spacer";

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

		this.m_xml = new XSimpleXMLNode ();
		this.m_xml.setupWithXMLString (__params[this.m_paramIndex++]);

		this.parseXML (0, this, this.m_xml);

		return this;
	}

	//------------------------------------------------------------------------------------------
	public cleanup ():void {
		super.cleanup ();
    }

	//------------------------------------------------------------------------------------------
	public getPercent (__value:string):number {
		if (__value.endsWith ("%")) {
			return XType.parseFloat (__value) / 100.0;
		}

		return -1;
	}

	//------------------------------------------------------------------------------------------
	public addHBoxFromXML (__box:Box, __xml:XSimpleXMLNode):Box {
		var __hbox:HBox = __box.addGameObjectAsChild (HBox, this.getLayer (), this.getDepth (), false) as HBox;
		__hbox.afterSetup ([
			__xml.hasAttribute ("width") ? __xml.getAttributeFloat ("width") : 300,
			__xml.hasAttribute ("height") ? __xml.getAttributeFloat ("height") : 150,
			__xml.hasAttribute ("justify") ? __xml.getAttributeString ("justify") : XJustify.SPACE_BETWEEN,
		]);

		return __hbox;
	}

	//------------------------------------------------------------------------------------------
	public addVBoxFromXML (__box:Box, __xml:XSimpleXMLNode):Box {
		var __vbox:VBox = __box.addGameObjectAsChild (VBox, this.getLayer (), this.getDepth (), false) as VBox;
		__vbox.afterSetup ([
			__xml.hasAttribute ("width") ? __xml.getAttributeFloat ("width") : 300,
			__xml.hasAttribute ("height") ? __xml.getAttributeFloat ("height") : 150,
			__xml.hasAttribute ("justify") ? __xml.getAttributeString ("justify") : XJustify.SPACE_BETWEEN,
		]);

		return __vbox;
	}

	//------------------------------------------------------------------------------------------
	private addButton (__box:Box, __xml:XSimpleXMLNode, __button:XButton):void {
		__box.addItem (__button);

		if (__xml.hasAttribute ("x")) {
			var __x:number = this.getPercent (__xml.getAttributeString ("x"));

			if (__x < 0) {
				__button.x = __xml.getAttributeFloat ("x");
			} else {
				__box.horizontalPercent (__button, __x);
			}	
		}

		if (__xml.hasAttribute ("y")) {
			var __y:number = this.getPercent (__xml.getAttributeString ("y"));

			if (__y < 0) {
				__button.y = __xml.getAttributeFloat ("y");
			} else {
				__box.verticalPercent (__button, __y);
			}
		}
	}

	//------------------------------------------------------------------------------------------
	public addSpriteButtonFromXML (__box:Box, __xml:XSimpleXMLNode):void {
		var __button:XSpriteButton = this.addGameObjectAsChild (
			XSpriteButton, this.getLayer (), this.getDepth (), false
		) as XSpriteButton;

		console.log (": addSpriteButtonFromXML: ", __xml.attributes ());

		__button.afterSetup ([
			__xml.hasAttribute ("buttonClassName") ? __xml.getAttributeString ("buttonClassName") : "StandardButton",
			__xml.hasAttribute ("9slice") ? __xml.getAttributeBoolean ("9slice") : false,
			__xml.hasAttribute ("9size") ? __xml.getAttributeFloat ("9size") : 0,
			__xml.hasAttribute ("9width") ? __xml.getAttributeFloat ("9width") : 0,
			__xml.hasAttribute ("9height") ? __xml.getAttributeFloat ("9height") : 0,
		]);

		this.addButton (__box, __xml, __button);
	}

	//------------------------------------------------------------------------------------------
	public addTextSpriteButtonFromXML (__box:Box, __xml:XSimpleXMLNode):void {
		var __button:XTextSpriteButton = __box.addGameObjectAsChild (
			XTextSpriteButton, this.getLayer (), this.getDepth (), false
		) as XTextSpriteButton;

		__button.afterSetup ([
			__xml.hasAttribute ("buttonClassName") ? __xml.getAttributeString ("buttonClassName") : "StandardButton",
			__xml.hasAttribute ("9slice") ? __xml.getAttributeBoolean ("9slice") : false,
			__xml.hasAttribute ("9size") ? __xml.getAttributeFloat ("9size") : 0,
			__xml.hasAttribute ("9width") ? __xml.getAttributeFloat ("9width") : 0,
			__xml.hasAttribute ("9height") ? __xml.getAttributeFloat ("9height") : 0,
			__xml.hasAttribute ("text") ? __xml.getAttribute ("text") : "",
			__xml.hasAttribute ("fontName") ? __xml.getAttribute ("fontName") : "Arial",
			__xml.hasAttribute ("fontSize") ? __xml.getAttributeFloat ("fontSize") : 20,
			__xml.hasAttribute ("colorNormal") ? __xml.getAttributeInt ("colorNormal") : 0x000000,
			__xml.hasAttribute ("colorOver") ? __xml.getAttributeInt ("colorOver") : 0x00ff00,
			__xml.hasAttribute ("colorDown") ? __xml.getAttributeInt ("colorDown") : 0x0000ff,
			__xml.hasAttribute ("colorSelected") ? __xml.getAttributeInt ("colorSelected") : 0xff0000,
			__xml.hasAttribute ("colorDisabled") ? __xml.getAttributeInt ("colorDisabled") : 0xc0c0c0,
			__xml.hasAttribute ("bold") ? __xml.getAttributeBoolean ("bold") : false,
			__xml.hasAttribute ("horizontalAlignment") ? __xml.getAttributeString ("horizontalAlignment") : "center",
			__xml.hasAttribute ("verticalAlignment") ? __xml.getAttributeString ("verticalAlignment") : "center"
		]);

		this.addButton (__box, __xml, __button);
	}

	//------------------------------------------------------------------------------------------
	public addTextButtonFromXML (__box:Box, __xml:XSimpleXMLNode):void {
		var __button:XTextButton = this.addGameObjectAsChild (
			XTextButton, 0, 0.0, false
		) as XTextButton;

		__button.afterSetup ([
			__xml.hasAttribute ("width") ? __xml.getAttributeFloat ("width") : 250,
			__xml.hasAttribute ("height") ? __xml.getAttributeFloat ("height") : 50,
			__xml.hasAttribute ("text") ? __xml.getAttribute ("text") : "",
			__xml.hasAttribute ("fontName") ? __xml.getAttribute ("fontName") : "Arial",
			__xml.hasAttribute ("fontSize") ? __xml.getAttributeFloat ("fontSize") : 20,
			__xml.hasAttribute ("colorNormal") ? __xml.getAttributeInt ("colorNormal") : 0x000000,
			__xml.hasAttribute ("colorOver") ? __xml.getAttributeInt ("colorOver") : 0x00ff00,
			__xml.hasAttribute ("colorDown") ? __xml.getAttributeInt ("colorDown") : 0x0000ff,
			__xml.hasAttribute ("colorSelected") ? __xml.getAttributeInt ("colorSelected") : 0xff0000,
			__xml.hasAttribute ("colorDisabled") ? __xml.getAttributeInt ("colorDisabled") : 0xc0c0c0,
			__xml.hasAttribute ("bold") ? __xml.getAttributeBoolean ("bold") : false,
			__xml.hasAttribute ("horizontalAlignment") ? __xml.getAttributeString ("horizontalAlignment") : "center",
			__xml.hasAttribute ("verticalAlignment") ? __xml.getAttributeString ("verticalAlignment") : "center"
		]);

		this.addButton (__box, __xml, __button);
	}

	//------------------------------------------------------------------------------------------
	public addSpacerFromXML (__box:Box, __xml:XSimpleXMLNode):void {
	}

    //------------------------------------------------------------------------------------------
    public parseXML (__depth:number, __box:Box, __xml:XSimpleXMLNode):void {
        var __tabs:Array<String> = ["", "...", "......", ".........", "............", "...............", "...................."];

        var __children:Array<XSimpleXMLNode> = __xml.child ("*");

        var i:number;

        for (i = 0; i < __children.length; i++) {
            var __xml:XSimpleXMLNode = __children[i];

			console.log (": ", __tabs[__depth], __xml.localName (), __xml.attribute ("buttonClassName"));
			
			switch (__xml.localName ()) {
				case XMLBox.HBox:
					this.parseXML (__depth + 1, this.addHBoxFromXML (__box, __xml), __xml);

					break;

				case XMLBox.VBox:
					this.parseXML (__depth + 1, this.addVBoxFromXML (__box, __xml), __xml);	

					break;

				case XMLBox.SpriteButton:
					this.addSpriteButtonFromXML (__box, __xml);

					break;

				case XMLBox.TextSpriteButton:
					this.addTextSpriteButtonFromXML (__box, __xml);

					break;

				case XMLBox.TextButton:
					this.addTextButtonFromXML (__box, __xml);

					break;

				case XMLBox.Spacer:
					this.addSpacerFromXML (__box, __xml);

					break;
			}
        }
	}
	
//------------------------------------------------------------------------------------------
}