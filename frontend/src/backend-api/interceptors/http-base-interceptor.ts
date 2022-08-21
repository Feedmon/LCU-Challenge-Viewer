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
      url: `./api/${url}`
    })

    return next.handle(decoratedRequest)
  }
}
