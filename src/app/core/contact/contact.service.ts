import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ContactRequest, ContactResponse } from './contact.model';

const ENDPOINT = '/api/contact';
const FALLBACK_ERROR = 'Something went wrong sending your message. Please try again, or email me directly.';

/** Posts a contact message to the Cloudflare Worker. The recipient address only exists server-side. */
@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);

  send(request: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(ENDPOINT, request).pipe(
      map((response) => (response.ok ? response : { ok: false as const, error: response.error || FALLBACK_ERROR })),
      catchError((error: HttpErrorResponse) => {
        const body = error.error as Partial<ContactResponse> | null;
        const message = body && body.ok === false && body.error ? body.error : FALLBACK_ERROR;
        return of({ ok: false as const, error: message });
      }),
    );
  }
}
