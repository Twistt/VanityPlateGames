using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace VanityPlateGames.MVC.Controllers
{
    [Route("api/[controller]")]
    public class ImageController : Controller
    {
        [Log(null)]
        public ReturnData PostFormData()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var fileid = httpRequest.Form["fileid"];
            if (httpRequest.Files.Count > 0)
            {
                if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Uploads/"))) Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Uploads/"));
                if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Downloads/"))) Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Downloads/"));
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var filePath = HttpContext.Current.Server.MapPath("~/Uploads/" + postedFile.FileName);
                    postedFile.SaveAs(filePath);
                    docfiles.Add(filePath);
                    var user = Common.GetUserFromHeader(ActionContext);

                    var ufile = new FileUpload() { FileName = postedFile.FileName, Processed = false, FileSize = postedFile.ContentLength, UploadedBy = user.Id, UploadDate = DateTime.Now };
                    if (fileid != null && fileid != string.Empty) ufile.ParentFileId = int.Parse(fileid);
                    return ParseData(filePath, ufile);
                }
                //result = Request.CreateResponse(HttpStatusCode.Created, docfiles);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return null;
        }
    }
}
