import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
// Note: Syncfusion license registration can be added here if needed
// import { registerLicense } from '@syncfusion/ej2-base';
// registerLicense('YOUR_LICENSE_KEY');

bootstrapApplication(AppComponent, {
  providers: []
}).catch((err) => console.error(err));
