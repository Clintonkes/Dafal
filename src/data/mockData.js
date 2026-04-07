import {
  BadgeCheck,
  Boxes,
  Fuel,
  ShieldCheck,
  TimerReset,
  Truck,
} from 'lucide-react'

export const companyDetails = {
  name: 'Dafal LLC',
  phone: '8326499452',
  email: 'dafalllc@proton.me',
  address: '4500 Travis St Apt 5531, Houston, TX 77002',
}

export const navLinks = [
  { label: 'Home', href: 'home' },
  { label: 'Services', href: 'services' },
  { label: 'Fleet', href: 'fleet' },
  { label: 'Track Order', href: 'tracking' },
  { label: 'Contact', href: 'contact' },
]

export const stats = [
  { label: 'Deliveries completed', value: 1840, suffix: '+' },
  { label: 'Active business clients', value: 128, suffix: '+' },
  { label: 'Fleet readiness rate', value: 98, suffix: '%' },
  { label: 'States covered', value: 36, suffix: '' },
]

export const services = [
  {
    title: 'Cargo Transport',
    description: 'Scheduled and urgent cargo movement with route visibility and dependable handoff.',
    icon: Truck,
  },
  {
    title: 'Bulk Delivery',
    description: 'High-volume loads coordinated for retail, industrial, and wholesale operations.',
    icon: Boxes,
  },
  {
    title: 'Long Distance Haulage',
    description: 'Cross-state haulage backed by live monitoring, route planning, and dispatch support.',
    icon: TimerReset,
  },
  {
    title: 'Contract Logistics',
    description: 'Reliable recurring logistics support for companies that need consistency at scale.',
    icon: Fuel,
  },
]

export const fleet = [
  {
    id: 'TRK-204',
    name: 'Freightliner Cascadia',
    type: 'Heavy Duty Tractor',
    capacity: '34 tons',
    availability: 'Available',
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'TRK-118',
    name: 'Volvo VNL',
    type: 'Long-Haul Carrier',
    capacity: '28 tons',
    availability: 'On Route',
    image:
      'https://images.unsplash.com/photo-1616432043562-3671ea2e5248?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'TRK-331',
    name: 'Kenworth T680',
    type: 'Regional Logistics Truck',
    capacity: '24 tons',
    availability: 'Available',
    image:
      'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=1200&q=80',
  },
]

export const trustBadges = [
  {
    title: 'Safe Delivery Guarantee',
    description: 'Structured handling procedures and route oversight reduce avoidable risk.',
    icon: ShieldCheck,
  },
  {
    title: 'Experienced Drivers',
    description: 'Professional operators with long-haul discipline and cargo responsibility.',
    icon: BadgeCheck,
  },
  {
    title: 'Real-Time Tracking',
    description: 'Track every load with status signals that keep your team informed.',
    icon: Truck,
  },
  {
    title: 'Reliable Operations',
    description: 'Dispatch routines and fleet readiness designed for dependable execution.',
    icon: TimerReset,
  },
]

export const testimonials = [
  {
    name: 'Angela Morrison',
    company: 'Morrison Retail Supply',
    rating: 5,
    quote:
      'Dafal made our interstate deliveries feel predictable again. Their updates are fast, clear, and professional.',
  },
  {
    name: 'James Holder',
    company: 'Holder Construction Group',
    rating: 5,
    quote:
      'We moved urgent bulk materials on a tight schedule, and the team handled it with impressive control.',
  },
  {
    name: 'Fatima Lewis',
    company: 'Lone Star Procurement',
    rating: 5,
    quote:
      'The booking experience is smooth, the drivers are courteous, and shipment tracking helps our clients trust us too.',
  },
]

export const initialOrders = [
  {
    id: 'DFL-001',
    customer: 'Morrison Retail Supply',
    status: 'In Transit',
    truckNumber: 'TRK-118',
    route: 'Houston, TX -> Dallas, TX',
    eta: '4 hrs 20 mins',
    cargo: 'Retail pallets',
  },
  {
    id: 'DFL-002',
    customer: 'Holder Construction Group',
    status: 'Pending',
    truckNumber: 'Awaiting assignment',
    route: 'Houston, TX -> Austin, TX',
    eta: 'Awaiting dispatch',
    cargo: 'Construction steel',
  },
  {
    id: 'DFL-003',
    customer: 'Lone Star Procurement',
    status: 'Delivered',
    truckNumber: 'TRK-204',
    route: 'Houston, TX -> San Antonio, TX',
    eta: 'Delivered',
    cargo: 'Industrial equipment',
  },
]

export const initialCustomers = [
  {
    id: 'CUS-100',
    name: 'Angela Morrison',
    company: 'Morrison Retail Supply',
    phone: '(713) 555-0148',
    orders: 12,
  },
  {
    id: 'CUS-101',
    name: 'James Holder',
    company: 'Holder Construction Group',
    phone: '(281) 555-0190',
    orders: 8,
  },
  {
    id: 'CUS-102',
    name: 'Fatima Lewis',
    company: 'Lone Star Procurement',
    phone: '(346) 555-0175',
    orders: 16,
  },
]

export const initialMessages = [
  {
    id: 'MSG-01',
    sender: 'Angela Morrison',
    topic: 'Delivery window confirmation',
    status: 'Open',
    excerpt: 'Please confirm if the Dallas shipment will still arrive before 4 PM.',
  },
  {
    id: 'MSG-02',
    sender: 'James Holder',
    topic: 'Invoice request',
    status: 'Resolved',
    excerpt: 'Need the final invoice copy attached to our completed order.',
  },
]
