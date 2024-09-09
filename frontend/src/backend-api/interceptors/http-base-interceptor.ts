import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

export class HttpBaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url: string;
    //openapi wants to use wrong path
    if (req.url.includes("/api/")) {
      url = req.url.split("/api/")[1]
    } else {
      url = req.url
    }

    const decoratedRequest: HttpRequest<any> = req.clone({
      url: `http://localhost:8080/api/${url}`
      // url: `./api/${url}` to make it work in dev environment or properly implement proxy conf or change electron or configure cors
    })

    return next.handle(decoratedRequest)
  }
}
