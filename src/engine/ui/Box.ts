//------------------------------------------------------------------------------------------
import * as PIXI from 'pixi.js-legacy';
import { XSprite } from '../sprite/XSprite';
import { XWorld } from '../sprite/XWorld';
import { XGameObject} from '../gameobject/XGameObject';
import { XTask } from "../task/XTask";
import { XSignal } from '../signals/XSignal';
import { XApp } from '../app/XApp';
import { XType } from '../type/XType';
import { TextInput } from 'pixi-textinput-v5';

//------------------------------------------------------------------------------------------
export class Box extends XGameObject {
    public m_width:number;
    public m_height:number;
    public m_justify:string;
    public m_spacing:number;
    public m_padding:number;
    public m_topPadding:number;
    public m_bottomPadding:number;
    public m_leftPadding:number;
    public m_rightPadding:number;
    public m_items:Array<PIXI.Sprite | TextInput>;

//------------------------------------------------------------------------------------------
	public constructor () {
		super ();
	}

//------------------------------------------------------------------------------------------
    public setup (__world:XWorld, __layer:number, __depth:number):XGameObject {
        super.setup (__world, __layer, __depth);

        this.m_items = new Array<PIXI.Sprite | TextInput> ();
        
        return this;
    }

//------------------------------------------------------------------------------------------
    public afterSetup (__params:Array<any> = null):XGameObject {
        super.afterSetup (__params);	

        this.m_width = __params[this.m_paramIndex++];
        this.m_height = __params[this.m_paramIndex++];
        this.m_justify = __params[this.m_paramIndex++];

        this.m_spacing = 0;
        this.m_padding = 0;
        this.m_leftPadding = 0;
        this.m_rightPadding = 0;
        this.m_topPadding = 0;
        this.m_bottomPadding = 0;

        return this;
    }

//------------------------------------------------------------------------------------------
    public cleanup ():void {
        super.cleanup ();
    }

//------------------------------------------------------------------------------------------
    public get width ():number {
        return this.m_width;
    }

//------------------------------------------------------------------------------------------
    public get height ():number {
        return this.m_height;
    }

//------------------------------------------------------------------------------------------
    public addItem (__item:PIXI.Sprite | TextInput, __layer:number = -1, __depth:number = -1, __visible:boolean = false):void {
        this.m_items.push (__item);

        this.reorder ();
    }

//------------------------------------------------------------------------------------------
    public removeItem (__item:PIXI.Sprite | TextInput):void {
        var __index:number = this.m_items.indexOf (__item);

        if (__index >= 0) {
            if (this.m_childSprites.has (__item)) {
                this.removeChildSprite (__item);
            }

            if (this.m_childObjects.has (__item as XGameObject)) {
                this.removeChildObject (__item as XGameObject);
            }

            this.m_items.splice (__index, 1);
        }
    }

//------------------------------------------------------------------------------------------
    public removeAllItems ():void {
        var __itemsToDelete:Array<PIXI.Sprite | TextInput> = new Array<PIXI.Sprite | TextInput> ();

        var i:number;

        for (i = 0; i < this.m_items.length; i++) {
            __itemsToDelete.push (this.m_items[i]);
        }

        for (i = 0; i < __itemsToDelete.length; i++) {
           this.removeItem (__itemsToDelete[i]);
        }
    }

//------------------------------------------------------------------------------------------
    public reorder ():void {
    }

//------------------------------------------------------------------------------------------
    public getActualWidth ():number {
        return this.m_width - this.m_leftPadding - this.m_rightPadding;
    }

//------------------------------------------------------------------------------------------
    public getActualHeight ():number {
        return this.m_height - this.m_topPadding - this.m_bottomPadding;
    }

//------------------------------------------------------------------------------------------	
}
	
