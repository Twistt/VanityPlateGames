using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Xamarin.Forms;

namespace VPG.Mobile
{
    public class App : Application
    {
        public App()
        {
            // The root page of your application
            var content = new ContentPage
            {

                Content = new WebView
                {
                    Source = "http://www.VanityPlateGames.com/Play"
                }
            };

            MainPage = new NavigationPage(content);
        }

        protected override void OnStart()
        {
            // Handle when your app starts
        }

        protected override void OnSleep()
        {
            // Handle when your app sleeps
        }

        protected override void OnResume()
        {
            // Handle when your app resumes
        }
    }
}
