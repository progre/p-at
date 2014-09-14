package net.prgrssv.flvplayer
{
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import org.libspark.ui.SWFWheel;
	
	/**
	 * ...
	 * @author ぷろぐれ
	 */
	[SWF(backgroundColor="#000000")]
	
	public class Main extends Sprite
	{
		private var player:Player;
		
		public function Main():void
		{
			var params:Object = loaderInfo.parameters;
			player = new Player(params["localIp"]);
			if (ExternalInterface.available)
			{
				ExternalInterface.addCallback("play", this.player.play);
				player.addEventListener(Player.DIMENSION_CHANGE, function():void
					{
						if (ExternalInterface.call(params["dimensionChanged"], player.width, player.height) === null)
						{
							throw new Error(params["dimensionChanged"]);
						}
					});
			}
			onStageAdded(function(e:Event = null):void
				{
					if (stage == null)
					{
						throw new Error();
					}
					stage.scaleMode = StageScaleMode.NO_SCALE;
					stage.align = StageAlign.TOP_LEFT;
					stage.addEventListener(Event.RESIZE, function(e:Event):void
						{
							player.resize(stage.stageWidth, stage.stageHeight);
						});
					player.resize(stage.stageWidth, stage.stageHeight);
					stage.addChild(player.video);
					if (ExternalInterface.available)
					{
						if (ExternalInterface.call(params["loaded"]) === null)
						{
							throw new Error(params["loaded"]);
						}
					}
					
					SWFWheel.initialize(stage);
					SWFWheel.browserScroll = false;
					
					stage.addEventListener(MouseEvent.MOUSE_WHEEL, function(ev:MouseEvent):void
						{
							if (ev.delta > 0)
							{
								player.incrementVolume();
							}
							else if (ev.delta < 0)
							{
								player.decrementVolume();
							}
							ev.stopPropagation();
						});
				});
		}
		
		private function onStageAdded(func:Function):void
		{
			if (this.stage != null)
			{
				func();
				return;
			}
			var callback:Function = function():void
			{
				removeEventListener(Event.ADDED_TO_STAGE, callback);
				func();
			};
			addEventListener(Event.ADDED_TO_STAGE, callback);
		}
	}
}