export class Device {
  name: string;
  id: string;
  advertising: ArrayBuffer;
  rssi: number;
  services: string [];
  characteristics: any;

  constructor(  ) {  }
}

/*      COMPLETE JSON FROM RASPBERRY PI
{
  "name":"skatePi",
  "id":"B8:27:EB:EC:D4:FA",
  "advertising":{},
  "rssi":-71,
  "services":["1800","1801","12ab"],
  "characteristics":
    [
      {
        "service":"1800",
        "characteristic":"2a00",
        "properties":["Read"]
      },

      {
        "service":"1800",
        "characteristic":"2a01",
        "properties":["Read"]
      },

      {
        "service":"1801",
        "characteristic":"2a05",
        "properties":["Indicate"],
        "descriptors":[{"uuid":"2902"}]
      },

      {
        "service":"12ab",
        "characteristic":"34cd",
        "properties":["Read","Write","Notify"],
        "descriptors":[{"uuid":"2902"}]
      }
    ]
}
*/
