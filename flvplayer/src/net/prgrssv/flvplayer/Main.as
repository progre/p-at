package net.prgrssv.flvplayer
{
	import adobe.utils.ProductManager;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	
	/**
	 * ...
	 * @author ぷろぐれ
	 */
	public class Main extends Sprite
	{
		private var player:Player = new Player();
		
		public function Main():void
		{
			stage.color = 0;
			if (ExternalInterface.available)
			{
				ExternalInterface.addCallback("play", this.player.play);
			}
			onStageAdded(function(e:Event = null):void
				{
					if (stage == null)
						throw new Error();
					player.resize(stage.stageWidth, stage.stageHeight);
					stage.addChild(player.video);
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