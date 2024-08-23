import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
export default class Header_RealEstateManagement extends NavigationMixin(LightningElement) {
  handleAboutUsPage() {
    console.log("we are handle about");
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "AboutUs__c",
      },
    });
  }
  handleHomePage(){
    this[NavigationMixin.Navigate]({
        type: "comm__namedPage",
        attributes: {
            name: "Home",
        }
    })
  }
}
