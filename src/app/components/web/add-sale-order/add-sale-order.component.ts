import { Component } from '@angular/core';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { Branch } from '../../../core/interfaces/branch';
import { Group } from '../../../core/interfaces/group';
import { IndependentBanner } from '../../../core/interfaces/independent-banner';
import { Island } from '../../../core/interfaces/Island';
import { PackingSlip } from '../../../core/interfaces/packing-slip';
import { PriceTier } from '../../../core/interfaces/price-tier';
import { SalesTeam } from '../../../core/interfaces/sales-team';
import { PdfService } from '../../../core/services/pdf.service';
import { BannerService } from '../../../services/banner-service/banner.service';
import { ContactService } from '../../../services/contact-service/contact.service';
import { ProductService } from '../../../services/product-service/product.service';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { MessageService } from 'primeng/api';
import { ContactEntity } from '../../../core/interfaces/contact';
import { DDLCin7Product } from '../../../core/interfaces/ddl-cin7-product';
import { LineItem } from '../../../core/interfaces/line-item';
import { FormBuilder } from '@angular/forms';
import { ImportFoodStuffOrder } from '../../../core/interfaces/import-foodstuff-dto';
import { SalesOrder } from '../../../core/interfaces/sales-order';

@Component({
  selector: 'app-add-sale-order',
  imports: [UtilsModule],
  templateUrl: './add-sale-order.component.html',
  styleUrl: './add-sale-order.component.scss'
})
export class AddSaleOrderComponent {
  packingSlips: PackingSlip[] = [];
  priceTiers: PriceTier[] = [];
  salesTeams: SalesTeam[] = [];
  branches: Branch[] = [];
  groups: Group[] = [];
  banners: IndependentBanner[] = [];
  islands: Island[] = [];
  displayUpdateModal = false;
  selectedStore: any;
  companies: ContactEntity[] = [];
  store: ContactEntity = {} as ContactEntity;
  salesOrderItems: LineItem[] = [];
  ddlProducts: DDLCin7Product[] = [];

  selectedProduct: DDLCin7Product = {} as DDLCin7Product;
  importFoodStuffOrder: ImportFoodStuffOrder = {} as ImportFoodStuffOrder;
  storeOptions: any[] = [];
  productOptions: any[] = [];

  subTotal: number = 0;
  totalQty: number = 0;
  tax: number = 0;
  grandTotal: number = 0;
  rowCount = 0;

  isSubmitted = false;
  issynced = false;
  isCashPickUp: boolean = false;
  phone: string = '';
  email: string = '';
  name: string = '';
  pickUpDate: string = '';
  pickupInstructions: string = '';
  bankDetails: string = '';
  salesOrder: SalesOrder = {};

  isShowStoreDetails = false;
  isSubmitDisabled = false;

  customerPoNumber: string = '';
  createdDate: Date = new Date();
  deliveryDate: Date | null = null;
  isSendEmail: boolean = true;
  isNotValidatePoNumber: boolean = false;
  replyEmails: string = '';
  selectedBranch: Branch | null = null;
  quantity: number | null = null;
  storeType: number = undefined;
  storeTypes: any[] = [
    {
      value: 1, label: 'Independent Stores (Regular)'
    },
    {
      value: 2, label: 'Independent Stores (Not Regular)'
    },
    {
      value: 3, label: 'Inactive Stores (Unable to move to Cin7)'
    },
    {
      value: 4, label: 'Woolworth'
    },
    {
      value: 5, label: 'Foodstuffs'
    }
  ]
  private readonly tolerance = 0.09;

  ngOnInit() {
    this.loadCompaniesByBannerId();
    this.loadAccountSettings();
    this.initData();
    this.loadPackingSlip();
    this.loadPriceTiers();
    this.loadSalesTeam();
    this.loadGroups();
    this.loadIndependentBanners();
    this.loadIslands();
    this.loadBranch();
  }

  loadAccountSettings() {
    this.salesOrderService.GetAccountSettings().subscribe((data) => {
      this.bankDetails = data.accountDetails;
    });
  }

  initData() {
    this.createdDate = new Date();
  }

  constructor(
    private contactService: ContactService,
    private productService: ProductService,
    private salesOrderService: SalesOrderService,
    private messageService: MessageService,
    private pdfService: PdfService,
    private bannerService: BannerService
  ) { }

  loadBranch() {
    this.contactService.GetBranches().subscribe((data) => {
      this.branches = data.sort((a, b) => a.branchName.localeCompare(b.branchName));
    });
  }

  loadCompaniesByBannerId() {
    this.contactService.GetCompaniesByType(this.storeType).subscribe(data => {
      this.companies = data;
      this.storeOptions = data.map(data => ({
        label: data.company || '',
        value: data,
        disabled: false
      }));
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load companies' });
      });
  }

  onStoreChange(event: any) {
    this.store = event.value.value;
    this.isShowStoreDetails = true;
    this.replyEmails = this.store?.replyEmail || '';
    this.loadDDLProducts();
  }

  loadDDLProducts() {
    if (!this.store) return;

    this.productService.getAllProducts().subscribe(data => {
      this.ddlProducts = data;
      // this.productOptions = data.filter(x => (x.price || 0) > 0).map(data => ({
      //   label: (data.styleCode + ' - ' + data.name + ' x' + data.quantityInCartion) || '',
      //   value: data,
      //   disabled: (data.stockOnHand || 0) <= 0
      // }));
    },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
      });
  }

  AddItem(): any {
    if (!this.selectedProduct) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select product!' });
      return false;
    }
    if (this.quantity == null) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Add Qty!' });
      return false;
    }

    const item: LineItem = {
      productOptionId: this.selectedProduct.productOptionId || 0,
      name: this.selectedProduct.name,
      code: this.selectedProduct.styleCode,
      uomPrice: this.selectedProduct.price,
      uomQtyOrdered: this.quantity,
      qty: (this.quantity || 0) * (this.selectedProduct.quantityInCartion || 0),
      unitPrice: parseFloat(((this.selectedProduct.price || 0) / (this.selectedProduct.quantityInCartion || 0)).toFixed(2)),
      total: parseFloat(((this.selectedProduct.price || 0) * this.quantity).toFixed(2)),
      uniqueId: ++this.rowCount,
      qtyInCarton: (this.selectedProduct.quantityInCartion || 0),
      stockAvailable: this.selectedProduct.stockOnHand
    };

    this.salesOrderItems.push(item);
    this.selectedProduct = null;
    this.quantity = null;
    this.calculateTotal();
  }

  removeItem(id: any) {
    this.salesOrderItems = this.salesOrderItems.filter(x => x.uniqueId != id);
    this.calculateTotal();
  }

  calculateTotal() {
    this.subTotal = parseFloat(this.salesOrderItems.reduce((sum, product) => sum + (product?.total || 0), 0).toFixed(2));
    this.totalQty = parseFloat(this.salesOrderItems.reduce((sum, product) => sum + (product?.uomQtyOrdered || 0), 0).toString());
    this.tax = parseFloat((this.subTotal * 0.15).toFixed(2));
    this.grandTotal = parseFloat((this.subTotal + this.tax).toFixed(2));
  }

  syncToCin7(): any {
    this.issynced = false;

    if (!this.store) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Select store!' });
      return false;
    }
    if (!this.customerPoNumber) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Add Customer No!' });
      return false;
    }
    if (!this.deliveryDate) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Add Due Date!' });
      return false;
    }
    if (this.salesOrderItems.length == 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please Add atleast 1 item' });
      return false;
    }
    if (this.store.minOrderQty && this.totalQty < (this.store?.minOrderQty || 0)) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Your order total qty is below mininmum order qty!' });
      return false;
    }

    const salesOrder: SalesOrder = {
      company: this.store.company,
      deliveryAddress1: this.store.address1,
      deliveryCity: this.store.city,
      deliveryPostalCode: this.store.postCode,
      deliveryCountry: this.store.country,
      deliveryState: this.store.state,
      billingAddress1: this.store.postalAddress1,
      billingCity: this.store.postalCity,
      billingCountry: this.store.postalCountry,
      billingPostalCode: this.store.postalPostCode,
      billingState: this.store.postalPostCode,
      memberId: this.store.id,
      productTotal: this.subTotal,
      isSendEmail: this.isSendEmail,
      isNotValidatePoNumber: this.isNotValidatePoNumber,
      branchId: this.selectedBranch?.cinBranchId,
      replyEmail: this.replyEmails,
      taxRate: 0.15,
      total: this.grandTotal,
      customerOrderNo: this.customerPoNumber,
      estimatedDeliveryDate: this.deliveryDate || new Date(),
      createdDate: this.createdDate,
      customFields: {
        orders_1000: this.store.accountNumber,
        orders_1001: this.store.packingSlip
      },
      lineItems: this.salesOrderItems
    };

    this.isSubmitted = true;
    this.salesOrderService.sendCustomSalesOrderToCin7(salesOrder).subscribe((data: any) => {
      if (data.message == "already exists") {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Customer Order Number already exists!" });
        this.isSubmitted = false;
      } else if (data.message == "1") {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Minimum Order is not fullfilled!" });
        this.isSubmitted = false;
      } else {
        if (this.isCashPickUp) {
          this.salesOrder = salesOrder;
          salesOrder.phone = this.phone;
          salesOrder.email = this.email;
          salesOrder.firstName = this.name;
          this.sendCashPickUpEmail();
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "Saved Successfully" });
        this.isSubmitted = false;
        this.issynced = true;
        this.reset();
        this.importFoodStuffOrder = data;
      }
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Failed to save order" });
      this.isSubmitted = false;
    });
  }

  reset() {
    this.customerPoNumber = "";
    this.subTotal = 0;
    this.deliveryDate = null;
    this.storeType = 0;
    this.store = null;
    this.replyEmails = "";
    this.tax = 0;
    this.grandTotal = 0;
    this.salesOrderItems = [];
    this.isShowStoreDetails = false;
  }

  sendCashPickUpEmail() {
    // this.pdfService.generatePdfBlobForCashPickUpOrders(['CashPickPDFContent'], this.email, this.name);

    // setTimeout(() => {
    //   this.phone = '';
    //   this.email = '';
    //   this.name = '';
    //   this.pickupInstructions = '';
    //   this.pickUpDate = '';
    //   this.salesOrder = {};
    // }, 1000);
  }

  exceedsTolerance(value1?: any, value2?: any): boolean {
    return Math.abs((value1 || 0) - (value2 || 0)) > this.tolerance;
  }

  refresh() {
    location.reload();
  }

  isSameDate(date1: any, date2: any): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  loadPackingSlip() {
    this.contactService.GetPackingSlips().subscribe(
      (data) => {
        this.packingSlips = data;
      });
  }

  loadPriceTiers() {
    this.contactService.GetPriceTiers().subscribe(
      (data) => {
        this.priceTiers = data;
      });
  }

  loadSalesTeam() {
    this.contactService.GetSalesTeam().subscribe(
      (data) => {
        this.salesTeams = data;
      });
  }

  loadGroups() {
    this.contactService.GetGroups().subscribe(
      (data) => {
        this.groups = data;
      });
  }

  loadIndependentBanners() {
    this.bannerService.getIndependentBanners().subscribe((data) => {
      this.banners = data;
    });
  }

  loadIslands() {
    this.contactService.GetIslands().subscribe((data) => {
      this.islands = data;
    });
  }

  showUpdateModal() {
    this.displayUpdateModal = true;
  }

  hideUpdateModal() {
    this.displayUpdateModal = false;
  }

  updateStore() {
    if (!this.store) return;

    this.isSubmitDisabled = true;
    this.contactService.updateStore(this.store).subscribe(data => {
      this.isSubmitDisabled = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Saved Successfully!" });
      this.displayUpdateModal = false;
    }, (error) => {
      this.isSubmitDisabled = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Failed to update store" });
    });
  }

  updateItemTotal(item: LineItem) {
    if (item.uomQtyOrdered && item.uomPrice) {
      item.total = (item.uomQtyOrdered || 0) * (item.uomPrice || 0);
      this.calculateTotal();
    }
  }
formatPriceColumn(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).replace('pricecolumn', 'Price Tier ');
}


 
}
