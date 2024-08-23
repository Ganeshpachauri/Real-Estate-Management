import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class Footer_RealEstateManagement extends NavigationMixin(LightningElement) {
    @track getYear = 2024;
    mapMarkers = [
        {
            location: {
                Street: 'RQJG+HWM, Sector 2, Hans Vihar, RIICO Industrial Area, Mansarovar, Jaipur, Rajasthan 302020',
                City: 'Jaipur',
                State: 'Rajasthan',
                Country: 'India',
                },
            icon: 'https: //www.google.com/mapfiles/marker.png',
            title: 'Briskminds Real Estate',
            draggable: true,
            visible: true,
        }
    ];
        // printing year at footer
        connectedCallback(){
            var date = new Date();
            this.getYear = date.getFullYear();
        }

        getAllProperyPage(){
            
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: 'AllProperties__c',
                },
            });
        }
}