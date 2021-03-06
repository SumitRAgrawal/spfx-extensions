import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderName, PlaceholderContent
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { AppInsights } from 'applicationinsights-js'


import * as strings from 'CustomHfApplicationCustomizerStrings';

const LOG_SOURCE: string = 'CustomHfApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICustomHfApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  key: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CustomHfApplicationCustomizer
  extends BaseApplicationCustomizer<ICustomHfApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    AppInsights.downloadAndSetup({ instrumentationKey: this.properties.key })
    AppInsights.startTrackPage();

    AppInsights.trackEvent('app-cust', <any>{
      'site_id': this.context.pageContext.site.id,
      'web_title': this.context.pageContext.web.title

    });

    AppInsights.setAuthenticatedUserContext(this.context.pageContext.user.email)

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholder)
    // Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

    return Promise.resolve();
  }

  private _renderPlaceholder(): void {
    this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top)
    this._topPlaceholder.domElement.innerHTML = `Hello Header`

    this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    this._bottomPlaceholder.domElement.innerHTML = 'Hello Footer'
  }
}
