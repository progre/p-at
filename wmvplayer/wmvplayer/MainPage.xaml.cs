using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Browser;
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
        public Controller Controller { get; private set; }

        public MainPage()
        {
            InitializeComponent();

            Controller = new Controller(this, media);
            HtmlPage.RegisterScriptableObject("Controller", Controller);
        }
    }
}
