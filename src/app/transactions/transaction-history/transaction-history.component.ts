import {Component, Input} from '@angular/core';
import {DatePipe, TitleCasePipe} from '@angular/common';
interface Transaction {
  id: number;
  montant: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: Date;
  solde_sender: number | null;
  solde_receiver: number | null;
  frais: number;
  type: string;
  senderId: number;
  receiverId?: number;
  receiverString?: string;
  sender: {
    id: number;
    identifiant: string;
  };
  receiver?: {
    id: number;
    identifiant: string;
  };
}
@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [
    TitleCasePipe,
    DatePipe
  ],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent {
  @Input() userId: number = 1;

  transactions: Transaction[] = [];
  periods = ['today', 'week', 'month'];
  selectedPeriod = 'today';

  ngOnInit() {
    this.transactions = this.generateTransactions();
  }

  setPeriod(period: string) {
    this.selectedPeriod = period;
    this.transactions = this.generateTransactions(); // Simuler le rechargement des données
  }

  generateTransactions(): Transaction[] {
    const transactions: Transaction[] = [];
    const types = ['TRANSFERT', 'DEPOT', 'RETRAIT'];
    const statuses: ('SUCCESS' | 'PENDING' | 'FAILED')[] = ['SUCCESS', 'PENDING', 'FAILED'];

    for (let i = 0; i < 5; i++) {
      const isSender = Math.random() > 0.5;
      const hasReceiver = Math.random() > 0.3;
      const amount = Math.floor(Math.random() * 1000) + 100;
      const fees = amount * 0.02;

      transactions.push({
        id: i + 1,
        montant: amount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        solde_sender: isSender ? amount + fees : null,
        solde_receiver: !isSender ? amount : null,
        frais: fees,
        type: types[Math.floor(Math.random() * types.length)],
        senderId: isSender ? this.userId : Math.floor(Math.random() * 1000),
        receiverId: hasReceiver ? Math.floor(Math.random() * 1000) : undefined,
        receiverString: !hasReceiver ? `User${Math.floor(Math.random() * 1000)}` : undefined,
        sender: {
          id: isSender ? this.userId : Math.floor(Math.random() * 1000),
          identifiant: `USER${Math.floor(Math.random() * 1000)}`
        },
        receiver: hasReceiver ? {
          id: Math.floor(Math.random() * 1000),
          identifiant: `USER${Math.floor(Math.random() * 1000)}`
        } : undefined
      });
    }

    return transactions;
  }

  getStatusStyles(status: string) {
    switch (status) {
      case 'SUCCESS':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-500'
        };
      case 'FAILED':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-500'
        };
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SUCCESS':
        return `<svg class="w-4 sm:w-5 h-4 sm:h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>`;
      case 'FAILED':
        return `<svg class="w-4 sm:w-5 h-4 sm:h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>`;
      default:
        return `<svg class="w-4 sm:w-5 h-4 sm:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>`;
    }
  }

  formatTransactionTitle(transaction: Transaction): string {
    const isSender = transaction.senderId === this.userId;
    const otherPartyId = isSender
      ? (transaction.receiver?.identifiant || transaction.receiverString)
      : transaction.sender.identifiant;

    return isSender ? `Payment to ${otherPartyId}` : `Payment from ${otherPartyId}`;
  }

  formatAmount(transaction: Transaction): string {
    const isSender = transaction.senderId === this.userId;
    const prefix = isSender ? '-' : '+';
    return `${prefix} $${transaction.montant.toFixed(2)}`;
  }
}
