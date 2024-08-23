import { LightningElement, track } from "lwc";
import heroPage_1 from "@salesforce/resourceUrl/heroPage_1";
import heroPage_2 from "@salesforce/resourceUrl/heroPage_2";
import heroPage_3 from "@salesforce/resourceUrl/heroPage_3";
import heroPage_4 from "@salesforce/resourceUrl/heroPage_4";
import property_Search_DropDown from "@salesforce/apex/RealEstateManagementController.property_Search_DropDown";
import fetchPropertiesMethod from "@salesforce/apex/RealEstateManagementController.fetchPropertiesMethod";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
// import { NavigationMixin } from 'lightning/navigation'; //lightning/navigation is a library
//NavigationMixin  is a module name
// note : type and attribute are compulsory
export default class Body_RealEstateManagement extends NavigationMixin(
  LightningElement
) {
  // images imported from static resource in salesforce
  hero0 = heroPage_1;
  hero1 = heroPage_2;
  hero2 = heroPage_3;
  hero3 = heroPage_4;

  @track propertyTypeValue = "";
  @track propertyTypePrice = "";
  @track propertyTypeCity = "";
  @track properties = [];

  @track showSpinner = false;
  // below variables helps as form query at client side only
  price = "Price__c";
  type = "Property_Type__c";
  city = "Property_City__c";
  @track showProperties = false;
  @track Property_Type_Options = [];
  @track Property_City_Options = [];
  @track Property_Price_Options = [
    {
      label: "10 lac - 30 lac",
      value: this.price + " >= 1000000 AND " + this.price + " <= 3000000",
    },
    {
      label: "30 lac - 60 lac",
      value: this.price + " >= 3000000 AND " + this.price + " <= 6000000",
    },
    {
      label: "60 lac - above",
      value: this.price + " >= 6000000 ",
    },
  ];

  PropertySearchChange(event) {
    const eventName = event.target.name;
    if (eventName == "propertyType")
      this.propertyTypeValue = event.target.value;
    else if (eventName == "propertyPrice")
      this.propertyTypePrice = event.target.value;
    else if (eventName == "propertyCity")
      this.propertyTypeCity = event.target.value;
  }
  // connectedCallBack function fires when a component is increated in the DOM
  connectedCallback() {
    this.showSpinner = true;
    property_Search_DropDown()
      .then((result) => {
        var valuesList = [];
        for (var item of result["Property_Type"])
          valuesList.push({
            label: item,
            value: this.type + " = '" + item + "'",
          });
        this.Property_Type_Options = valuesList;
        valuesList = [];
        for (var item of result["Property_City"])
          valuesList.push({
            label: item,
            value: this.city + " = '" + item + "'",
          });
        this.Property_City_Options = valuesList;
        this.showSpinner = false;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchProperties() {
    this.showSpinner = true;
    var query = "";
    query = this.propertyTypeCity != "" ? this.propertyTypeCity : query;
    query =
      this.propertyTypeValue != ""
        ? query != ""
          ? (query += " AND " + this.propertyTypeValue)
          : (query += " " + this.propertyTypeValue)
        : query;
    query =
      this.propertyTypePrice != ""
        ? query != ""
          ? (query += " AND " + this.propertyTypePrice)
          : (query += " " + this.propertyTypePrice)
        : query;
    fetchPropertiesMethod({ query: query })
      .then((result) => {
        console.log("=========== wow =============");
        console.log(result);
        console.log("--------------=>");
        this.properties = [];
        for (let pro of result) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            pro.Property_Photos__c,
            "text/html"
          );
          const imgElement = doc.querySelector("img");
          const imageUrl = imgElement ? imgElement.src : "";
          this.properties.push({
            Title: pro.Property_Title__c,
            Name: pro.Name,
            type: pro.Property_Type__c,
            city: pro.Property_City__c,
            price: pro.Price__c,
            image: imageUrl,
            id: pro.Id,
            BHK: pro.BHK__c,
            Size: pro.Area__c,
          });
        }
        console.log(this.properties);
      })
      .catch((error) => {
        console.log(error);
        this.ShowToast(
          "Error",
          "We caught an error while fetching properties",
          "error",
          "dismissable"
        );
      })
      .finally(() => {
        this.propertyTypeCity = "";
        this.propertyTypeValue = "";
        this.propertyTypePrice = "";
        this.showProperties = true;
        this.showSpinner = false;
      });
  }

  getPropertyDetail(event) {
    var propertyId = event.currentTarget.dataset.proid;
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: "propertydetail__c",
      },
      state: {
        propertyId: propertyId,
      },
    });
  }

  // method for handling ShowToast
  ShowToast(title, message, variant, mode) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
      mode: mode,
    });
    this.dispatchEvent(evt);
  }
}
