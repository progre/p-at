using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

namespace wmvplayer
{
    public partial class MainPage : UserControl
    {
        public MainPage()
        {
            InitializeComponent();

            var streamId = "";
            var ip = "";
            media.Source = new Uri("mms://127.0.0.1:7144/stream/" + streamId + ".wmv?tip=" + ip, UriKind.Absolute);
        }
    }
}
