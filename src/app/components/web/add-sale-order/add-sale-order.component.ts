import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ContactService } from '../../../services/contact-service/contact.service';
import { ProductService } from '../../../services/product-service/product.service';
import { SalesOrderService } from '../../../services/sales-order-service/sales-order.service';
import { BannerService } from '../../../services/banner-service/banner.service';

import { Branch } from '../../../core/interfaces/branch';
import { Group } from '../../../core/interfaces/group';
import { IndependentBanner } from '../../../core/interfaces/independent-banner';
import { Island } from '../../../core/interfaces/Island';
import { PackingSlip } from '../../../core/interfaces/packing-slip';
import { PriceTier } from '../../../core/interfaces/price-tier';
import { SalesTeam } from '../../../core/interfaces/sales-team';
import { ContactEntity } from '../../../core/interfaces/contact';
import { Product } from '../../../core/interfaces/product';
import { LineItem } from '../../../core/interfaces/line-item';
import { SalesOrder } from '../../../core/interfaces/sales-order';
import { ImportFoodStuffOrder } from '../../../core/interfaces/import-foodstuff-dto';
import { UtilsModule } from '../../../core/utilities/utils.module';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service/auth.service';
import { IUser } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-add-sale-order',
  standalone: true,
  imports: [
    UtilsModule,
    RouterLink
  ],
  templateUrl: './add-sale-order.component.html',
  styleUrls: ['./add-sale-order.component.scss'],
  providers: [MessageService]
})
export class AddSaleOrderComponent {
  taxInclusive: boolean = false;

  // Data collections
  packingSlips: PackingSlip[] = [];
  priceTiers: PriceTier[] = [];
  salesTeams: SalesTeam[] = [];
  branches: Branch[] = [];
  groups: Group[] = [];
  banners: IndependentBanner[] = [];
  islands: Island[] = [];
  companies: ContactEntity[] = [];
  products: Product[] = [];

  // Form models
  selectedStore: ContactEntity | null = null;
  selectedProduct: Product | null = null;
  selectedBranch: Branch | null = null;

  // Order details
  salesOrderItems: LineItem[] = [];
  customerPoNumber: string = '';
  createdDate: Date = new Date();
  deliveryDate: Date | null = null;
  isSendEmail: boolean = true;
  isNotValidatePoNumber: boolean = false;
  replyEmails: string = '';
  isQtyInCarton: boolean = true;
  quantity: number | null = null;

  // Order calculations
  subTotal: number = 0;
  totalQty: number = 0;
  tax: number = 0;
  grandTotal: number = 0;
  rowCount = 0;

  // UI states
  isSubmitted = false;
  issynced = false;
  isShowStoreDetails = false;
  displayUpdateModal = false;
  bankDetails: string = '';

  // Cash pickup
  isCashPickUp: boolean = false;
  phone: string = '';
  email: string = '';
  name: string = '';
  pickUpDate: string = '';
  pickupInstructions: string = '';
  loggedInUser: IUser = <IUser>{};

  // Import order data
  importFoodStuffOrder: ImportFoodStuffOrder | null = null;

  constructor(
    private contactService: ContactService,
    private productService: ProductService,
    private salesOrderService: SalesOrderService,
    private bannerService: BannerService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.loggedInUser = this.authService.getUserData();
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loadCompanies();
    this.loadPackingSlips();
    this.loadPriceTiers();
    this.loadSalesTeams();
    this.loadGroups();
    this.loadIndependentBanners();
    this.loadIslands();
    this.loadBranches();

  }

  loadAccountSettings() {
    this.salesOrderService.GetAccountSettings().subscribe({
      next: (data) => this.bankDetails = data.accountDetails,
      error: () => this.showError('Failed to load account settings')
    });
  }

  loadCompanies() {
    this.contactService.getAllCompanies().subscribe({
      next: (data) => this.companies = data,
      error: () => this.showError('Failed to load companies')
    });
  }

  loadProducts() {
    if (!this.selectedStore?.contactId) return;

    this.productService.GetAllProductsByTierWisePricing(this.selectedStore.contactId).subscribe({
      next: (data) => this.products = data,
      error: () => this.showError('Failed to load products')
    });
  }

  loadPackingSlips() {
    this.contactService.GetPackingSlips().subscribe({
      next: (data) => this.packingSlips = data,
      error: () => this.showError('Failed to load packing slips')
    });
  }

  loadPriceTiers() {
    this.contactService.GetPriceTiers().subscribe({
      next: (data) => this.priceTiers = data,
      error: () => this.showError('Failed to load price tiers')
    });
  }

  loadSalesTeams() {
    this.contactService.GetSalesTeam().subscribe({
      next: (data) => this.salesTeams = data,
      error: () => this.showError('Failed to load sales teams')
    });
  }

  loadGroups() {
    this.contactService.GetGroups().subscribe({
      next: (data) => this.groups = data,
      error: () => this.showError('Failed to load groups')
    });
  }

  loadIndependentBanners() {
    this.bannerService.getIndependentBanners().subscribe({
      next: (data) => this.banners = data,
      error: () => this.showError('Failed to load banners')
    });
  }

  loadIslands() {
    this.contactService.GetIslands().subscribe({
      next: (data) => this.islands = data,
      error: () => this.showError('Failed to load islands')
    });
  }

  loadBranches() {
    this.contactService.GetBranches().subscribe({
      next: (data) => {
        // Sort the branches
        this.branches = data;

        // Select the first branch as the default if there are any branches
        if (this.branches && this.branches.length > 0) {
          this.selectedBranch = this.branches[0];
          console.log(this.branches, this.selectedBranch);
        }
      },
      error: () => this.showError('Failed to load branches')
    });
  }

  onStoreChange() {
    if (!this.selectedStore) return;

    this.isShowStoreDetails = true;
    this.replyEmails = this.selectedStore.replyEmail || '';
    this.loadProducts();
  }

  addItem() {
    if (!this.selectedProduct) {
      this.showWarn('Please select a product');
      return;
    }

    if (this.quantity === null || this.quantity <= 0) {
      this.showWarn('Please enter a valid quantity');
      return;
    }

    const unit = this.selectedProduct.unit || 1;
    const unitPrice = this.selectedProduct.price || 0;

    // Calculate quantities based on mode
    const qty = this.isQtyInCarton ? this.quantity * unit : this.quantity;
    const uomQtyOrdered = this.isQtyInCarton ? this.quantity : this.quantity / unit;
    const uomPrice = unitPrice * unit; // Always carton price (unitPrice * units per carton)

    const item: LineItem = {
      productOptionId: this.selectedProduct.id || 0,
      name: this.selectedProduct.name,
      code: this.selectedProduct.code,
      unitPrice: unitPrice,        // Always base unit price
      uomPrice: uomPrice,          // Carton price (unitPrice * unit)
      qtyInCarton: unit,
      uniqueId: ++this.rowCount,
      stockAvailable: this.selectedProduct.stockInHand || 0,
      uomQtyOrdered: uomQtyOrdered, // Cartons if carton mode, fraction if unit mode
      qty: qty,                    // Always in base units
      total: unitPrice * qty,
      createdDate: this.formatDateForBackend(this.createdDate || new Date()),
    };

    this.salesOrderItems.push(item);
    this.selectedProduct = null;
    this.quantity = null;
    this.calculateTotal();
  }


  removeItem(id: number) {
    this.salesOrderItems = this.salesOrderItems.filter(x => x.uniqueId !== id);
    this.calculateTotal();
  }

  updateItemTotal(item: LineItem) {
    const unit = item.qtyInCarton || 1;

    if (this.isQtyInCarton) {
      // Carton mode: uomQtyOrdered is cartons, qty is units
      item.qty = (item.uomQtyOrdered || 0) * unit;
    } else {
      // Unit mode: qty is units, uomQtyOrdered is carton equivalent
      item.uomQtyOrdered = (item.qty || 0) / unit;
    }

    // uomPrice is always unitPrice * units per carton
    item.uomPrice = (item.unitPrice || 0) * unit;

    // Total is always unitPrice * qty (in units)
    item.total = (item.unitPrice || 0) * (item.qty || 0);

    this.calculateTotal();
  }
  calculateTotal() {
    this.subTotal = parseFloat(this.salesOrderItems.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2));
    this.totalQty = parseFloat(this.salesOrderItems.reduce((sum, item) => sum + (item.uomQtyOrdered || 0), 0).toString());
    if (this.taxInclusive) {
      this.tax = parseFloat((this.subTotal * 0.10).toFixed(2));
    } else {
      this.tax = 0;
    }
    this.grandTotal = parseFloat((this.subTotal + this.tax).toFixed(2));
  }

  syncToCin7() {
    this.issynced = false;

    if (!this.validateOrder()) return;

    const salesOrder: SalesOrder = {
      orderMode: this.isQtyInCarton ? 'CARTON' : 'UNIT',
      company: this.selectedStore?.company || '',
      deliveryAddress1: this.selectedStore?.address1 || '',
      deliveryCity: this.selectedStore?.city || '',
      deliveryPostalCode: this.selectedStore?.postCode || '',
      deliveryCountry: this.selectedStore?.country || '',
      deliveryState: this.selectedStore?.state || '',
      billingAddress1: this.selectedStore?.postalAddress1 || '',
      billingCity: this.selectedStore?.postalCity || '',
      billingCountry: this.selectedStore?.postalCountry || '',
      billingPostalCode: this.selectedStore?.postalPostCode || '',
      billingState: this.selectedStore?.postalState || '',
      phone: this.selectedStore?.phone || '',
      memberId: this.selectedStore?.contactId || 0,
      productTotal: this.subTotal,
      isSendEmail: this.isSendEmail,
      isNotValidatePoNumber: this.isNotValidatePoNumber,
      replyEmail: this.replyEmails,
      taxRate: this.taxInclusive ? 0.10 : 0,
      total: this.grandTotal,
      customerOrderNo: this.customerPoNumber,
      estimatedDeliveryDate:  this.formatDateForBackend(this.deliveryDate || new Date()),
      createdDate: this.formatDateForBackend(this.createdDate || new Date()),
      customFields: {
        orders_1000: this.selectedStore?.accountNumber || '',
        orders_1001: this.selectedStore?.packingSlip || ''
      },
      lineItems: this.salesOrderItems,
      branchId: this.selectedBranch?.cinBranchId,
      createdBy: this.loggedInUser.userId,
    };

    this.isSubmitted = true;
    this.salesOrderService.sendCustomSalesOrderToCin7(salesOrder).subscribe({
      next: (data) => this.handleOrderResponse(data, salesOrder),
      error: () => {
        // this.showError('Failed to save order');
        this.messageService.add({ severity: 'error', summary: "PO Number Already Used", detail: 'The PO number your entered has already been used. Please verify the PO number. If You Still Wish to proceed with creating this Sales Order enable the "Disable PO Validation" option and click "Save"' })
        // this.showError('The PO number your entered has already been used. Please verify the PO number. If You Still Wish to proceed with creating this Sales Order enable the "Disable PO Validation" option and click "Save"');
        this.isSubmitted = false;
      }
    });
  }

  validateOrder(): boolean {
    if (!this.selectedStore) {
      this.showWarn('Please select a store');
      return false;
    }

    if (!this.customerPoNumber) {
      this.showWarn('Please enter a PO number');
      return false;
    }

    if (!this.deliveryDate) {
      this.showWarn('Please select a delivery date');
      return false;
    }

    if (this.salesOrderItems.length === 0) {
      this.showWarn('Please add at least one item');
      return false;
    }

    // if (this.selectedStore.minOrderQty && this.totalQty < (this.selectedStore.minOrderQty || 0)) {
    //   this.showWarn(`Your order total quantity is below the minimum order quantity of ${this.selectedStore.minOrderQty} carton(s)`);
    //   return false;
    // }

    return true;
  }

  handleOrderResponse(data: any, salesOrder: SalesOrder) {
    if (data.message === "already exists") {
      this.showError('Customer Order Number already exists!');
      this.isSubmitted = false;
    } else if (data.message === "1") {
      this.showSuccess('Email has been sent to the Customer for Approval');
      this.reset();
    } else {
      if (this.isCashPickUp) {
        salesOrder.phone = this.phone;
        salesOrder.email = this.email;
        salesOrder.firstName = this.name;
        // this.sendCashPickUpEmail();
      }
      this.showSuccess('Order created successfully');
      this.issynced = true;
      this.importFoodStuffOrder = data;
      this.reset();
    }
    this.isSubmitted = false;
  }

  reset() {
    this.customerPoNumber = '';
    this.subTotal = 0;
    this.deliveryDate = null;
    this.selectedStore = null;
    this.replyEmails = '';
    this.tax = 0;
    this.grandTotal = 0;
    this.salesOrderItems = [];
    this.isShowStoreDetails = false;
    this.products = [];
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showWarn(message: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  formatPriceTier(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).replace('pricecolumn', 'Price Tier ');
  }


  onPriceEdit(item: LineItem) {
    const unit = item.qtyInCarton || 1;
    item.uomPrice = (item.unitPrice || 0) * unit;
    item.total = (item.unitPrice || 0) * (item.qty || 0);
    this.calculateTotal();
  }


  private formatDateForBackend(date: Date): string {
    // Get date parts in local timezone
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const day = date.getDate();

    // Return as ISO format (YYYY-MM-DD)
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
}