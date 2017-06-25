using ArachnidCreations.DevTools;
using Imager;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VPG.GAME.Models;

namespace VPG.GAME.Controllers
{
    public class PlayController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        // GET: Play
        public void ShowImage(int width, int height, Int64 quality, int imageid)
        {
            //var img = ORM.GetSingle<FileUpload>(null,"FileUploads", imageid);
            var img = Cache.FileUploads.Where(f => f.Id == imageid).FirstOrDefault();
            //usage: http://localhost:53417/Image.aspx?image=screenshot.png&width=500&height=500&quality=50L

            //int width = 400;
            //int height = 400;
            //Int64 quality = 100L;
            string image = imageid +"_"+ img.FileName;
            if (Request.QueryString["width"] != null) width = int.Parse(Request.QueryString["width"].ToString());
            if (Request.QueryString["height"] != null) height = int.Parse(Request.QueryString["height"].ToString());
            if (Request.QueryString["image"] != null) image = Request.QueryString["image"].ToString();
            if (Request.QueryString["qaulity"] != null) quality = Int64.Parse(Request.QueryString["image"].ToString());

            System.Drawing.Image screener;
            if (width >= height) screener = acImager.CreatOverlay(width, height, Server.MapPath("/Uploads/" + image), Color.Black);
            else screener = acImager.CreatOverlay(width, height, Server.MapPath("/Uploads/" + image), Color.Black);

            if (image.Contains("\"")) image = image.Replace("\"", "'");
            if (image.Contains("^")) image = image.Replace("^", "'");

            MemoryStream MemStream = new MemoryStream();
            // set the content type 
            Response.ContentType = "image/jpg";
            //send the image to the memory stream then output 
            ImageCodecInfo jgpEncoder = GetEncoder(ImageFormat.Jpeg);

            // Create an Encoder object based on the GUID 
            // for the Quality parameter category.
            System.Drawing.Imaging.Encoder myEncoder = System.Drawing.Imaging.Encoder.Quality;

            // Create an EncoderParameters object. 
            // An EncoderParameters object has an array of EncoderParameter 
            // objects. In this case, there is only one 
            // EncoderParameter object in the array.
            EncoderParameters myEncoderParameters = new EncoderParameters(1);

            EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, quality);
            myEncoderParameters.Param[0] = myEncoderParameter;
            screener.Save(MemStream, jgpEncoder, myEncoderParameters);
            //screener.Save(MemStream, ImageCodecInfo.GetImageEncoders(), myEncoderParameters);
            //screener.Save(MemStream, System.Drawing.Imaging.ImageFormat.Png, myEncoderParameters);
            MemStream.WriteTo(Response.OutputStream);
        }
        private ImageCodecInfo GetEncoder(ImageFormat format)
        {

            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();

            foreach (ImageCodecInfo codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;

        }
    }
    
}