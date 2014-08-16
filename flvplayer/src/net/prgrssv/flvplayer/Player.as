package net.prgrssv.flvplayer
{
	import flash.display.Stage;
	import flash.events.NetStatusEvent;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	
	/**
	 * ...
	 * @author ぷろぐれ
	 */
	public class Player
	{
		public var video:Video = new Video();
		private var netStream:NetStream;
		
		public function Player()
		{
			var netConnection:NetConnection = new NetConnection();
			netConnection.connect(null);
			netStream = new NetStream(netConnection);
			netStream.client = {};
			netStream.addEventListener(NetStatusEvent.NET_STATUS, function(event:NetStatusEvent):void
				{
					if (event.info.code == "NetStream.Play.StreamNotFound")
					{
						trace("Video Not Found");
					}
				});
			video.attachNetStream(netStream);
			video.visible = true;
		}
		
		public function resize(width:Number, height:Number):void
		{
			video.width = width;
			video.height = height;
		}
		
		public function play(url:String):void
		{
			netStream.play(url)
		}
		
		public function setVolume(volumeStr:String):void
		{
			var volume:Number = parseFloat(volumeStr) / 100.0;
			if (volume < 0)
			{
				volume = 0;
			}
			else if (volume > 1.0)
			{
				volume = 1.0;
			}
			netStream.soundTransform = new SoundTransform(volume);
		}
	}
}