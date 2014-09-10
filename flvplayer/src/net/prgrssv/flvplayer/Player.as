package net.prgrssv.flvplayer
{
	import flash.display.Stage;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.NetStatusEvent;
	import flash.media.SoundTransform;
	import flash.media.Video;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	
	/**
	 * ...
	 * @author ぷろぐれ
	 */
	public class Player extends EventDispatcher
	{
		public static const DIMENSION_CHANGE:String = "dimension_change";
		public var video:Video = new Video();
		private var netStream:NetStream;
		private var localIp:String;
		private var currentSource:String;
		
		public function Player(localIp:String)
		{
			this.localIp = localIp;
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
					else if (event.info.code == "NetStream.Play.Start")
					{
						dispatchEvent(new Event(DIMENSION_CHANGE));
					}
					else if (event.info.code == "NetStream.Buffer.Full" || event.info.code == "NetStream.Buffer.Empty")
					{
					}
					else
					{
						throw new Error(event.info.code);
					}
				});
			video.attachNetStream(netStream);
			video.visible = true;
		}
		
		public function get width():int
		{
			return video.videoWidth;
		}
		
		public function get height():int
		{
			return video.videoHeight;
		}
		
		public function resize(width:Number, height:Number):void
		{
			video.width = width;
			video.height = height;
		}
		
		public function play(streamId:String, remoteIp:String):void
		{
			var source:String = "http://" + localIp + "/stream/" + streamId + ".flv?tip=" + remoteIp;
			if (currentSource != null && source == currentSource) {
				return;
			}
			currentSource = source;
			netStream.play(source);
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