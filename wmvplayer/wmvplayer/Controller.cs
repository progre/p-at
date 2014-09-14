using System;
using System.Net;
using System.Threading;
using System.Windows;
using System.Windows.Browser;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace wmvplayer
{
    public class Controller
    {
        private readonly UserControl userControl;
        private readonly MediaElement media;
        private string streamId = "";
        private string remoteIp = "";

        [ScriptableMemberAttribute]
        public string LocalIp { get; set; }
        [ScriptableMemberAttribute]
        public double width { get { return this.media.NaturalVideoWidth; } }
        [ScriptableMemberAttribute]
        public double height { get { return this.media.NaturalVideoHeight; } }

        [ScriptableMemberAttribute]
        public event RoutedEventHandler mediaOpened
        {
            add { this.media.MediaOpened += value; }
            remove { this.media.MediaOpened -= value; }
        }

        [ScriptableMemberAttribute]
        public event MouseButtonEventHandler click
        {
            add { userControl.MouseLeftButtonUp += value; }
            remove { userControl.MouseLeftButtonUp -= value; }
        }

        public Controller(UserControl userControl, MediaElement media)
        {
            this.userControl = userControl;
            this.media = media;
        }

        [ScriptableMemberAttribute]
        public void Play(string streamId, string remoteIp)
        {
            this.streamId = streamId;
            this.remoteIp = remoteIp;
            media.Source = new Uri(string.Format("mms://{0}/stream/{1}.wmv?tip={2}", LocalIp, streamId, remoteIp), UriKind.Absolute);
            media.Play();
        }

        [ScriptableMemberAttribute]
        public void Stop()
        {
            media.Stop();
            media.Source = new Uri(string.Format("http://{0}/admin?cmd=stop&id={1}", LocalIp, streamId));
            media.Play();
        }

        public void IncrementVolume()
        {
            var volume = media.Volume + 0.05;
            if (volume > 1.0)
            {
                volume = 1.0;
            }
            media.Volume = volume;
        }

        public void DecrementVolume()
        {
            var volume = media.Volume - 0.05;
            if (volume < 0.0)
            {
                volume = 0.0;
            }
            media.Volume = volume;
        }
    }
}
