"use client";

import { useState, useEffect } from "react";
import { UserCircle, HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Activity, Zap, Shield, Sun, Cloud, CloudRain, Send, Smartphone, Landmark, Receipt, PiggyBank, CreditCard, Gift, Bus, Handshake, FastForward, QrCode, Home, Mail, User, RotateCcw } from "lucide-react";
import Image from 'next/image';

// Mock data and state shape
const initialWalletBalance = 340.00;
const defaultFloat = 800.00;

export default function GAgadApp() {
  const [currentScreen, setCurrentScreen] = useState("HOME"); 
  const [activeTab, setActiveTab] = useState("Borrow");
  const [activeRepaymentTab, setActiveRepaymentTab] = useState("Overview");
  const [walletBalance, setWalletBalance] = useState(initialWalletBalance);

  // Negosyante State
  const [isNegosyanteUnlocked, setIsNegosyanteUnlocked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [vendorType, setVendorType] = useState("");
  const [restockTime, setRestockTime] = useState("");
  const [dailySales, setDailySales] = useState("");
  
  // Float State
  const [floatBalance, setFloatBalance] = useState(0); // How much float they have taken
  const [repaidAmount, setRepaidAmount] = useState(0);
  const [selectedFloatAmount, setSelectedFloatAmount] = useState(800);
  
  // Simulation State
  const [transactions, setTransactions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showZoomedQR, setShowZoomedQR] = useState(false);

  const ARCHETYPE_CONFIG = {
    "wet-market": {
      "₱1,000 - ₱2,500":  { min: 500,  rec: 800,  max: 1200, deduct: "8%",  release: "3:30 AM" },
      "₱2,500 - ₱5,000":  { min: 1000, rec: 1800, max: 2500, deduct: "8%",  release: "3:30 AM" },
      "₱5,000+": { min: 2000, rec: 3500, max: 5000, deduct: "10%", release: "3:30 AM" }
    },
    "street-food": {
      "₱1,000 - ₱2,500":  { min: 500,  rec: 800,  max: 1200, deduct: "6%",  release: "1:00 PM" },
      "₱2,500 - ₱5,000":  { min: 1000, rec: 1500, max: 2500, deduct: "7%",  release: "1:00 PM" },
      "₱5,000+": { min: 1500, rec: 2500, max: 3500, deduct: "8%",  release: "1:00 PM" }
    },
    "sari-sari": {
      "₱1,000 - ₱2,500":  { min: 500,  rec: 1000, max: 1500, deduct: "5%",  release: "8:00 AM" },
      "₱2,500 - ₱5,000":  { min: 1000, rec: 1800, max: 2500, deduct: "5%",  release: "8:00 AM" },
      "₱5,000+": { min: 2000, rec: 3000, max: 4500, deduct: "6%",  release: "8:00 AM" }
    }
  };

  const getArchetypeInsight = () => {
    if (!vendorType && !restockTime && !dailySales) return null;

    if (!vendorType || !restockTime || !dailySales) {
      return {
        title: "Sinisiyasat ang Iyong Negosyo...",
        copy: "Kumpletuhin ang tatlong (3) tanong sa ibaba para makita ang katugmang archetype at ma-set ang iyong initial float.",
        suggestedFloat: "₱--",
        releaseTime: "--:--",
        autoDeduct: "--%"
      };
    }

    let title = "";
    let copy = "";
    
    let archetypeKey = "wet-market";
    if (vendorType === "🍢 Street Food") archetypeKey = "street-food";
    if (vendorType === "🏪 Sari-Sari") archetypeKey = "sari-sari";
    
    // Default to lowest tier if invalid
    const salesKey = dailySales || "₱1,000 - ₱2,500";
    const config = ARCHETYPE_CONFIG[archetypeKey][salesKey] || ARCHETYPE_CONFIG[archetypeKey]["₱1,000 - ₱2,500"];
    
    let suggestedFloat = `₱${config.min.toLocaleString()} - ₱${config.max.toLocaleString()}`;
    let releaseTime = config.release;
    let autoDeduct = config.deduct;
    let floatOptions = [config.min, config.rec, config.max];

    if (vendorType === "🐟 Isda / Karne") {
      if (restockTime === "Madaling Araw (3 AM - 5 AM)") {
        if (dailySales === "₱1,000 - ₱2,500") {
          title = "⚡ Katugma ng 12,400+ Wet Market Vendors";
          copy = `Karamihan sa namimili tuwing 4 AM bagsakan ay nakakabawi ng benta bago mag-11 AM. Magsisimula sa ${suggestedFloat} float na ire-release ng madaling araw.`;
        } else if (dailySales === "₱2,500 - ₱5,000") {
          title = "⚡ Katugma ng 8,900+ Seafood/Meat Vendors";
          copy = `Mataas na kita tuwing umaga ang na-detect. Naka-set ang initial dawn float mo sa ${suggestedFloat} para may pandagdag ka sa pamamakyaw.`;
        } else {
          title = "⚡ High-Volume Wet Market Archetype";
          copy = `Nakalaan para sa malakihang pamamakyaw tuwing madaling araw na may ₱${config.min.toLocaleString()}+ na initial float.`;
        }
      } else {
        title = "🐟 Morning Market Archetype";
        copy = "Naka-set para sa mga nagtitinda sa palengke tuwing umaga na may malakas na benta mula 7 AM - 12 PM.";
      }
    } else if (vendorType === "🥬 Gulay / Prutas") {
      title = "🌱 Katugma ng 9,200+ Vegetable & Fruit Vendors";
      copy = "Naka-on ang spoilage buffer. Naka-set ang float at auto-deductions para sa unti-unting benta sa buong araw. 🌧️ Awtomatikong naka-link ang Storm-Day Parametric relief.";
    } else if (vendorType === "🍢 Street Food") {
      if (dailySales === "₱5,000+") {
        title = "🍢 Katugma ng High-Turnover Food Vendors";
        copy = "Naka-set para sa malakasang paghahanda at pamimili tuwing hapon at pagbabayad kapag malakas ang benta sa gabi.";
      } else {
        title = "🍢 Katugma ng 15,100+ Food & Merienda Vendors";
        copy = `Kadalasan ang pamimili ng sangkap ay sa hapon at lumalakas ang benta mula 5 PM - 9 PM. Ang float ay ire-release ng ${releaseTime}.`;
      }
    } else if (vendorType === "🏪 Sari-Sari") {
      title = "🏪 Katugma ng 22,000+ Neighborhood Retailers";
      copy = `Tuloy-tuloy ang benta sa buong araw. Ang float ay naka-set para sa araw ng delivery at may maliit na ${autoDeduct} auto-deductions.`;
    } else {
      title = "🔄 Sinusuri ang Profile...";
      copy = "Pakipili ang iyong pangunahing tinda para makita ang katugmang archetype para sa iyong negosyo.";
    }

    return { title, copy, suggestedFloat, releaseTime, autoDeduct, floatOptions };
  };

  // --- SCREEN 1: HOME / DASHBOARD (NATIVE CLONE) ---
  const renderScreen1 = () => (
    <div className="page-container fade-enter-active" style={{ padding: 0, backgroundColor: '#F4F6FB', display: 'flex', flexDirection: 'column' }}>
      
      {/* Scrollable Area */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', scrollbarWidth: 'none' }}>
        {/* Blue Header Background (Extends behind everything) */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '260px', backgroundColor: '#005CEE', zIndex: 0, borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}></div>

        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          


          {/* Hello & Help Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px 12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>G</span>
              </div>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>Hello!</span>
            </div>
            <div style={{ backgroundColor: 'rgba(0, 43, 115, 0.4)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: '600' }}>HELP</span>
            </div>
          </div>

          {/* Segmented Tabs */}
          <div style={{ display: 'flex', padding: '0 16px', gap: '8px', marginBottom: '12px' }}>
            {['Wallet', 'Borrow', 'Invest'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: '20px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  backgroundColor: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#005CEE' : '#D0E2FF',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Blue Balance Container */}
          <div style={{ padding: '0 16px 12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'white' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.5px', color: '#D0E2FF', fontWeight: '500' }}>AVAILABLE BALANCE</p>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>👁</span>
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: '700' }}>₱ {walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            </div>
            <button style={{ backgroundColor: 'white', color: '#005CEE', border: 'none', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              + Cash In
            </button>
          </div>

          {/* Dynamic Tab Content */}
          <div style={{ padding: '16px 16px 40px 16px', minHeight: '400px' }}>
            {activeTab === 'Wallet' && (
              <div className="fade-enter-active">
                {/* 4x2 Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 8px', backgroundColor: 'white', padding: '24px 16px', borderRadius: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                  {[
                    { name: 'Send', icon: <Send size={20} strokeWidth={2.5} /> },
                    { name: 'Load', icon: <Smartphone size={20} strokeWidth={2.5} /> },
                    { name: 'Transfer', icon: <Landmark size={20} strokeWidth={2.5} /> },
                    { name: 'Bills', icon: <Receipt size={20} strokeWidth={2.5} /> },
                    { name: 'GSave', icon: <PiggyBank size={20} strokeWidth={2.5} /> },
                    { name: 'Cards', icon: <CreditCard size={20} strokeWidth={2.5} /> },
                    { name: 'A+ Rewards', icon: <Gift size={20} strokeWidth={2.5} /> },
                    { name: 'Commute', icon: <Bus size={20} strokeWidth={2.5} /> }
                  ].map(action => (
                    <div key={action.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#005CEE' }}>
                        {action.icon}
                      </div>
                      <span style={{ fontSize: '12px', color: '#333', fontWeight: '500', textAlign: 'center' }}>{action.name}</span>
                    </div>
                  ))}
                </div>

                {/* Explore the App */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '700' }}>Explore the App</h2>
                  <span style={{ color: '#005CEE', fontSize: '13px', fontWeight: '600' }}>View All →</span>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', margin: '0 -16px', padding: '0 16px', scrollbarWidth: 'none' }}>
                  {['US Account', 'GInsure', 'Food Hub (HOT)', 'Travel', 'GForest'].map(item => (
                    <div key={item} style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '500', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', whiteSpace: 'nowrap' }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Borrow' && (
              <div className="fade-enter-active">
                {/* Existing Credit Products Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', color: '#005CEE' }}>
                      <Handshake size={18} strokeWidth={2.5} />
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '2px' }}>GLoan</h4>
                    <p style={{ fontSize: '11px', color: '#64748B' }}>Up to ₱125k</p>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#EFF6FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', color: '#005CEE' }}>
                      <CreditCard size={18} strokeWidth={2.5} />
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '2px' }}>GCredit</h4>
                    <p style={{ fontSize: '11px', color: '#64748B' }}>Up to ₱50k</p>
                  </div>
                </div>

                {/* GAgad Hero Feature Card */}
                {!isNegosyanteUnlocked ? (
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1.5px solid #005CEE', boxShadow: '0 8px 24px rgba(0, 92, 238, 0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ backgroundColor: '#EFF6FF', padding: '4px 8px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '9px', fontWeight: '700', color: '#005CEE', letterSpacing: '0.3px' }}>NEW • PARA SA MGA NMSMEs</span>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                      <Image 
                        src="/GAgad%20Logo.png" 
                        alt="GAgad Logo" 
                        width={60} 
                        height={70} 
                        style={{ objectFit: 'contain' }} 
                        priority 
                      />
                    </div>
                    
                    <p style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', lineHeight: '1.3' }}>
                      Pondo sa umaga, bawas sa benta. Walang fixed due date, walang DTI permit needed.
                    </p>

                    <button 
                      onClick={() => setCurrentScreen("ONBOARDING")}
                      style={{ width: '100%', padding: '12px 0', backgroundColor: '#005CEE', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0, 92, 238, 0.2)' }}
                    >
                      I-unlock ang Negosyante Tag <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1.5px solid #10B981', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ backgroundColor: '#DCFCE7', padding: '4px 8px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '9px', fontWeight: '800', color: '#15803D', letterSpacing: '0.5px' }}>✔ NEGOSYANTE TAG: ACTIVE</span>
                      </div>
                      <span style={{ fontSize: '14px' }}>⚡</span>
                    </div>
                    
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005CEE', marginBottom: '4px' }}>GAgad Negosyo Hub</h3>
                    <p style={{ fontSize: '12px', color: '#475569', marginBottom: '12px', lineHeight: '1.4' }}>
                      Naka-calibrate sa iyong negosyo profile. Buksan para sa Float, Benta Insights, at Storm Insurance.
                    </p>

                    <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                        Available Float: {getArchetypeInsight()?.suggestedFloat || "₱500 - ₱1,200"}
                      </p>
                    </div>

                    <button 
                      onClick={() => setCurrentScreen("MAIN_HUB")}
                      style={{ width: '100%', padding: '12px 0', backgroundColor: '#005CEE', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0, 92, 238, 0.2)' }}
                    >
                      Buksan ang GAgad Hub <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Invest' && (
              <div className="fade-enter-active" style={{ textAlign: 'center', paddingTop: '40px', color: '#64748B' }}>
                <p>Invest tab content here</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* GCash Bottom Navigation Bar */}
      <div style={{ backgroundColor: 'white', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'flex-end', padding: '12px 8px', borderTop: '1px solid #E2E8F0', zIndex: 10, position: 'relative' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#005CEE' }}>
          <Home size={24} strokeWidth={2.5} />
          <span style={{ fontSize: '11px', fontWeight: '700' }}>Home</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
          <Mail size={24} strokeWidth={2} />
          <span style={{ fontSize: '11px', fontWeight: '600' }}>Inbox</span>
        </div>
        
        {/* Floating Middle QR Button Container (acts as a spacer in the grid) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '100%' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', border: '4px solid #005CEE', color: '#005CEE' }}>
               <QrCode size={28} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8' }}>QR</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#94A3B8' }}>
          <Receipt size={24} strokeWidth={2} />
          <span style={{ fontSize: '11px', fontWeight: '600' }}>Transactions</span>
        </div>
        
        <div 
          onClick={() => setCurrentScreen("ONBOARDING")}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#94A3B8', cursor: 'pointer' }}
        >
          <User size={24} strokeWidth={2} />
          <span style={{ fontSize: '11px', fontWeight: '600' }}>Profile</span>
        </div>
      </div>
    </div>
  );

  // --- SCREEN 2: NEGOSYANTE TAG ONBOARDING ---
  // --- SCREEN 2: ONBOARDING / NEGOSYANTE SETUP ---


  const renderScreen2 = () => {
    const isComplete = vendorType && restockTime && dailySales;
    const insight = getArchetypeInsight();

    return (
      <div className="page-container fade-enter-active" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ArrowLeft size={24} onClick={() => setCurrentScreen("HOME")} style={{ cursor: 'pointer', marginRight: '16px' }} />
          <h1 style={{ fontSize: '18px', fontWeight: '700' }}>Negosyante Setup</h1>
        </div>

        {/* Dynamic Insight Banner */}
        {insight && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '14px', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#0369A1', marginBottom: '4px' }}>{insight.title}</h3>
            <p style={{ fontSize: '12px', color: '#0C4A6E', marginBottom: '10px', lineHeight: '1.3' }}>{insight.copy}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', borderTop: '1px solid rgba(186, 230, 253, 0.5)', paddingTop: '10px' }}>
              <div>
                <p style={{ fontSize: '9px', color: '#0369A1', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Float</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#0C4A6E' }}>{insight.suggestedFloat}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#0369A1', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Release</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#0C4A6E' }}>{insight.releaseTime}</p>
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#0369A1', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Deduct</p>
                <p style={{ fontSize: '11px', fontWeight: '700', color: '#0C4A6E' }}>{insight.autoDeduct}</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>1. Ano ang pangunahing tinda mo?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["🐟 Isda / Karne", "🥬 Gulay / Prutas", "🍢 Street Food", "🏪 Sari-Sari"].map(type => (
                <button 
                  key={type}
                  onClick={() => setVendorType(type)}
                  style={{
                    padding: '8px 12px', borderRadius: '16px', fontSize: '13px',
                    border: vendorType === type ? '1.5px solid #005CEE' : '1px solid #E2E8F0',
                    backgroundColor: vendorType === type ? '#EFF6FF' : 'white',
                    color: vendorType === type ? '#005CEE' : '#333'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>2. Anong oras ka pumapakyaw / bagsakan?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["Madaling Araw (3 AM - 5 AM)", "Umaga (6 AM - 8 AM)", "Tanghali / Hapon"].map(time => (
                <button 
                  key={time}
                  onClick={() => setRestockTime(time)}
                  style={{
                    padding: '8px 12px', borderRadius: '16px', fontSize: '12px',
                    border: restockTime === time ? '1.5px solid #005CEE' : '1px solid #E2E8F0',
                    backgroundColor: restockTime === time ? '#EFF6FF' : 'white',
                    color: restockTime === time ? '#005CEE' : '#333'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>3. Tantiyang benta kada araw?</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["₱1,000 - ₱2,500", "₱2,500 - ₱5,000", "₱5,000+"].map(sales => (
                <button 
                  key={sales}
                  onClick={() => setDailySales(sales)}
                  style={{
                    padding: '8px 12px', borderRadius: '16px', fontSize: '12px',
                    border: dailySales === sales ? '1.5px solid #005CEE' : '1px solid #E2E8F0',
                    backgroundColor: dailySales === sales ? '#EFF6FF' : 'white',
                    color: dailySales === sales ? '#005CEE' : '#333'
                  }}
                >
                  {sales}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', paddingBottom: '16px' }}>
          <button 
            disabled={!isComplete} 
            style={{ width: '100%', padding: '14px', backgroundColor: isComplete ? '#005CEE' : '#CBD5E1', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '700', fontSize: '14px' }}
            onClick={() => {
              setIsNegosyanteUnlocked(true);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
              setCurrentScreen("HOME");
            }}
          >
            I-activate ang Negosyante Tag
          </button>
        </div>
      </div>
    );
  };

  // --- SCREEN 3: GAGAD MAIN HUB (3-PILLAR NEGOSYO COCKPIT) ---
  const renderScreen3 = () => {
    const insight = getArchetypeInsight();
    const options = insight?.floatOptions || [500, 800, 1200];
    const deductRate = insight?.autoDeduct || "8%";
    const currentSelected = selectedFloatAmount || options[1];

    return (
      <div className="page-container fade-enter-active" style={{ backgroundColor: '#F4F6FB', scrollbarWidth: 'none' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#005CEE', padding: '16px 16px 24px 16px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: 'white' }}>
            <ArrowLeft size={24} onClick={() => setCurrentScreen("HOME")} style={{ cursor: 'pointer', marginRight: '16px' }} />
            <h1 style={{ fontSize: '18px', fontWeight: '700' }}>GAgad Negosyo Hub</h1>
            <div style={{ marginLeft: 'auto' }}>
              <UserCircle size={28} color="white" opacity={0.8} />
            </div>
          </div>
          <div style={{ padding: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>Aling Tess Fresh Fish • Palengke</h2>
              {floatBalance > 0 && (
                <div 
                  onClick={() => setShowZoomedQR(true)}
                  style={{ backgroundColor: 'white', borderRadius: '10px', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                >
                  <QrCode size={32} color="#005CEE" />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '12px', color: '#D0E2FF' }}>Negosyante Tag: Good Standing</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', marginTop: '-20px' }}>
          
          {/* Module 1: GAgad Float (Working Capital Card) */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1.5px solid #005CEE', boxShadow: '0 4px 12px rgba(0, 92, 238, 0.08)', marginBottom: '16px' }}>
            {floatBalance === 0 ? (
              <>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#005CEE', marginBottom: '16px', whiteSpace: 'nowrap', letterSpacing: '-0.5px' }}>
                  Available Restocking Float: ₱{currentSelected.toLocaleString()}
                </h3>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {options.map((amount, index) => (
                    <button 
                      key={amount}
                      onClick={() => setSelectedFloatAmount(amount)}
                      style={{
                        flex: 1, padding: '12px 0', borderRadius: '12px', fontSize: '14px', fontWeight: '700',
                        border: currentSelected === amount ? '2px solid #005CEE' : '1px solid #E2E8F0',
                        backgroundColor: currentSelected === amount ? '#EFF6FF' : 'white',
                        color: currentSelected === amount ? '#005CEE' : '#475569',
                        position: 'relative'
                      }}
                    >
                      ₱{amount.toLocaleString()}
                      {index === 1 && (
                        <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#005CEE', color: 'white', fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '10px', whiteSpace: 'nowrap' }}>REC</div>
                      )}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: '12px', color: '#475569', marginBottom: '16px', lineHeight: '1.4' }}>
                  Awtomatikong binabawas ({deductRate}) sa bawat QR Ph benta. Walang fixed due date.
                </p>

                <button 
                  onClick={() => {
                    setShowConfirmation(true);
                    setTimeout(() => {
                      setWalletBalance(prev => prev + selectedFloatAmount);
                      setFloatBalance(selectedFloatAmount);
                      setShowConfirmation(false);
                      setCurrentScreen("DASHBOARD");
                    }, 2000);
                  }}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#005CEE', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(0, 92, 238, 0.2)' }}
                >
                  Kumuha ng Float Ngayon
                </button>
              </>
            ) : floatBalance > 0 && repaidAmount >= floatBalance ? (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>
                  🎉 Float Fully Paid!
                </h3>
                <p style={{ fontSize: '14px', color: '#334155', marginBottom: '16px' }}>
                  Nabayaran mo na ng buo ang iyong <strong>₱{floatBalance.toLocaleString()}</strong> float. Pwede ka nang kumuha ulit para pandagdag puhunan.
                </p>
                <button 
                  onClick={() => {
                    setFloatBalance(0);
                    setRepaidAmount(0);
                  }}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#005CEE', color: 'white', borderRadius: '24px', border: 'none', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 12px rgba(0, 92, 238, 0.2)' }}
                >
                  Kumuha Ulit ng Float
                </button>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#10B981', marginBottom: '8px' }}>
                  Active Restocking Float
                </h3>
                <p style={{ fontSize: '14px', color: '#334155', marginBottom: '16px' }}>
                  Kasalukuyang nagbabayad ng <strong>₱{floatBalance.toLocaleString()}</strong> float. Awtomatikong nagkakaltas ang {deductRate} sa bawat benta.
                </p>
                <button 
                  onClick={() => setCurrentScreen("DASHBOARD")}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#EFF6FF', color: '#005CEE', border: '1.5px solid #005CEE', borderRadius: '24px', fontWeight: '700', fontSize: '14px' }}
                >
                  View Live Repayment Tracker
                </button>
              </>
            )}
          </div>

          {/* Module 3: GInsure Portal Button */}
          <div 
            onClick={() => setCurrentScreen("GINSURE")}
            style={{ backgroundColor: '#F0F9FF', padding: '16px', borderRadius: '16px', border: '1px solid #BAE6FD', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 2px 8px rgba(3, 105, 161, 0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: 'white', padding: '8px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <Shield size={20} color="#0369A1" />
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0369A1' }}>GInsure</h3>
                <span style={{ fontSize: '12px', color: '#0C4A6E' }}>Storm-Day Relief Protection</span>
              </div>
            </div>
            <ArrowRight size={18} color="#0369A1" />
          </div>

          {/* Module 2: General Insights & Sales Rhythm Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '6px', borderRadius: '8px' }}>
                <Activity size={18} color="#1E293B" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1E293B' }}>Negosyo Insights & Pattern</h3>
            </div>
            
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: '1.4' }}>
              {insight?.title} ({insight?.copy.substring(0, 80)}...)
            </p>

            {/* Mini 7-Day Trend Chart */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', marginBottom: '8px', gap: '4px' }}>
                {[{ d: 'M', h: '30%' }, { d: 'T', h: '40%' }, { d: 'W', h: '45%' }, { d: 'T', h: '50%' }, { d: 'F', h: '80%' }, { d: 'S', h: '100%' }, { d: 'S', h: '90%' }].map((day, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '100%', height: day.h, backgroundColor: i >= 4 ? '#005CEE' : '#CBD5E1', borderRadius: '4px 4px 0 0', opacity: i >= 4 ? 1 : 0.6 }}></div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <span key={i} style={{ fontSize: '10px', color: '#64748B', fontWeight: i >= 4 ? '700' : '500' }}>{day}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#FFFBEB', padding: '12px', borderRadius: '12px', border: '1px solid #FEF3C7' }}>
              <span style={{ fontSize: '14px' }}>💡</span>
              <p style={{ fontSize: '12px', color: '#B45309', lineHeight: '1.3' }}>
                Tip: Mas mataas ang benta tuwing Sabado. I-adjust ang float bago mag-weekend.
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // --- SCREEN 4: CONFIRMATION MODAL ---
  if (showConfirmation) {
    return (
      <div className="page-container fade-enter-active" style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <div style={{ animation: 'bounceIn 0.5s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <CheckCircle2 size={48} color="var(--color-success)" />
          </div>
          <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>₱{selectedFloatAmount.toFixed(2)} Agad Float Credited!</h2>
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', fontSize: '15px' }}>
            Balance updated instantly. 8% QR Auto-deduction is now active.
          </p>
        </div>
      </div>
    );
  }

  // --- SCREEN 5: LIVE ACTIVITY FEED & DASHBOARD ---
  const simulateQRTransaction = () => {
    const grossAmount = Math.floor(Math.random() * 100) + 50; // Random sale between 50 and 150
    const deduction = parseFloat((grossAmount * 0.08).toFixed(2));
    
    // Check if repayment exceeds float
    const actualDeduction = (repaidAmount + deduction) > floatBalance ? Math.max(0, floatBalance - repaidAmount) : deduction;
    
    if (actualDeduction > 0) {
      setRepaidAmount(prev => parseFloat((prev + actualDeduction).toFixed(2)));
    }
    
    setWalletBalance(prev => parseFloat((prev + (grossAmount - actualDeduction)).toFixed(2)));
    
    const newTx = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      desc: `QR Ph Sale - Suki`,
      gross: grossAmount,
      deduction: actualDeduction
    };
    
    setTransactions(prev => [newTx, ...prev]);
  };

  const renderScreen5 = () => {
    const progressPercent = Math.min(100, floatBalance > 0 ? Math.round((repaidAmount / floatBalance) * 100) : 0);
    const remaining = Math.max(0, floatBalance - repaidAmount);

    return (
      <div className="page-container fade-enter-active" style={{ padding: 0, backgroundColor: '#F4F6FB', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header */}
        <div style={{ backgroundColor: '#005CEE', paddingTop: '16px', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'white' }}>
            <ArrowLeft size={24} onClick={() => setCurrentScreen("MAIN_HUB")} style={{ cursor: 'pointer', marginRight: '16px' }} />
            <h1 style={{ fontSize: '18px', fontWeight: '600' }}>Live Repayment Tracker</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', scrollbarWidth: 'none' }}>
          {activeRepaymentTab === "Overview" && (
            <div className="fade-enter-active">
              
              {/* Simulation Action Header (Moved to Overview) */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  onClick={simulateQRTransaction}
                  disabled={remaining <= 0}
                  style={{ flex: 1, height: '44px', border: '1.5px dashed #005CEE', backgroundColor: '#EFF6FF', color: '#005CEE', fontSize: '12px', fontWeight: '700', borderRadius: '12px', opacity: remaining <= 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <QrCode size={16} strokeWidth={2.5} /> + QR Sale
                </button>
                <button 
                  onClick={() => {
                    const diff = floatBalance - repaidAmount;
                    if (diff > 0) {
                      setRepaidAmount(floatBalance);
                      setWalletBalance(prev => prev - diff); // Since it was paid, deduct from wallet
                      
                      const newTx = {
                        id: Date.now(),
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        desc: `Bulk Sale (Fast Forward)`,
                        gross: diff / 0.08,
                        deduction: diff
                      };
                      setTransactions(prev => [newTx, ...prev]);
                    }
                  }}
                  disabled={remaining <= 0}
                  style={{ flex: 1, height: '44px', border: '1.5px solid #10B981', backgroundColor: '#ECFDF5', color: '#059669', fontSize: '12px', fontWeight: '700', borderRadius: '12px', opacity: remaining <= 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <FastForward size={16} strokeWidth={2.5} /> To 100%
                </button>
              </div>

              {/* Card 1: Float Repayment Progress Card */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textAlign: 'center', marginBottom: '16px' }}>Float Repayment Progress</h3>
                
                <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 24px auto' }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#005CEE" strokeWidth="10" 
                      strokeDasharray={`${progressPercent * 2.83} 283`} 
                      strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.5s ease' }} 
                    />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>{progressPercent}%</span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Nabayaran</span>
                  </div>
                </div>
                
                {/* Bottom Metrics Box */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Total Paid</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B' }}>₱{repaidAmount.toFixed(2)}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Remaining Balance</p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#005CEE' }}>₱{remaining.toFixed(2)}</p>
                  </div>
                </div>

                {/* Start Again Action (Only when 100% Repaid) */}
                {progressPercent === 100 && (
                  <div style={{ marginTop: '16px', animation: 'fadeIn 0.5s' }}>
                    <button 
                      onClick={() => {
                        setFloatBalance(0);
                        setRepaidAmount(0);
                        setCurrentScreen("MAIN_HUB");
                      }}
                      style={{
                        width: '100%', padding: '14px', backgroundColor: '#10B981', color: 'white', 
                        borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={18} strokeWidth={2.5} /> Kumuha Ulit ng Float
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Smart Merchant Insight Nudge */}
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '14px', display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <Sun size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.4' }}>
                  <strong>Insight:</strong> Mas mataas ang benta mo tuwing Sabado ng umaga. Gusto mo bang i-adjust ang float mo sa ₱1,200 bago mag-weekend?
                </p>
              </div>

              {/* Card 3: 30-Day Cap Countdown */}
              <div style={{ backgroundColor: 'white', padding: '12px 16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Day 4 of 30 • Auto-deducting 8% per QR Ph transaction.</span>
              </div>
            </div>
          )}

          {activeRepaymentTab === "Telemetry" && (
            <div className="fade-enter-active">
              <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>Real-Time Transaction Stream</h3>

              {/* Telemetry Feed List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.map(tx => (
                  <div key={tx.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>{tx.desc}</p>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: '#00C48C' }}>+₱{tx.gross.toFixed(2)}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontSize: '11px', color: '#94A3B8' }}>{tx.time} • Order #{Math.floor(Math.random() * 9000) + 1000}</p>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#005CEE' }}>Auto-deduct (8%): -₱{tx.deduction.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                {/* Weather Parametric Telemetry Item */}
                <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '12px', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CloudRain size={16} color="#0369A1" />
                  <p style={{ fontSize: '11px', color: '#0369A1', lineHeight: '1.4' }}>
                    <strong>PAGASA Sensor:</strong> Normal Weather (Rainfall &lt; 5mm/hr • Flood Risk: Low)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Segmented Sub-Tab Bar */}
        <div style={{ backgroundColor: 'white', padding: '12px 16px 24px 16px', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ background: '#F1F5F9', padding: '4px', borderRadius: '999px', display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setActiveRepaymentTab("Overview")}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '999px', border: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                backgroundColor: activeRepaymentTab === "Overview" ? 'white' : 'transparent',
                color: activeRepaymentTab === "Overview" ? '#005CEE' : '#64748B',
                boxShadow: activeRepaymentTab === "Overview" ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveRepaymentTab("Telemetry")}
              style={{
                flex: 1, padding: '10px 0', borderRadius: '999px', border: 'none', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                backgroundColor: activeRepaymentTab === "Telemetry" ? 'white' : 'transparent',
                color: activeRepaymentTab === "Telemetry" ? '#005CEE' : '#64748B',
                boxShadow: activeRepaymentTab === "Telemetry" ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
              }}
            >
              ⚡ Telemetry
              {transactions.length > 0 && <div style={{ width: '6px', height: '6px', backgroundColor: '#10B981', borderRadius: '50%' }}></div>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- SCREEN 6: GINSURE PAGE ---
  const renderScreen6 = () => {
    return (
      <div className="page-container fade-enter-active" style={{ backgroundColor: '#F4F6FB', scrollbarWidth: 'none', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#0369A1', padding: '16px 16px 24px 16px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            <ArrowLeft size={24} onClick={() => setCurrentScreen("MAIN_HUB")} style={{ cursor: 'pointer', marginRight: '16px' }} />
            <h1 style={{ fontSize: '18px', fontWeight: '700' }}>GInsure</h1>
          </div>
        </div>

        <div style={{ padding: '16px', marginTop: '-12px', flex: 1 }}>
          
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#F0F9FF', padding: '10px', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
                <Shield size={24} color="#0369A1" />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Storm-Day Relief</h3>
                <span style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>● Active Protection</span>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: '14px', color: '#334155', marginBottom: '12px', lineHeight: '1.5' }}>
                Ikaw ay covered ng <strong>₱300 non-repayable payout</strong> sa tuwing may idedeklarang PAGASA Signal #1 o heavy rainfall warning sa iyong registered na area.
              </p>
              
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#EFF6FF', padding: '12px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                <span style={{ fontSize: '16px' }}>💡</span>
                <p style={{ fontSize: '12px', color: '#1E40AF', lineHeight: '1.4' }}>
                  <strong>Hindi ito utang.</strong> Ito ay tulong-pinansyal mula sa micro-insurance pool upang matulungan kang makabawi sa nasirang paninda o matumal na benta tuwing may bagyo.
                </p>
              </div>
            </div>
          </div>

          {/* iOS Style Weather Widget */}
          <div style={{ backgroundColor: '#3A82F6', backgroundImage: 'linear-gradient(180deg, #3A82F6 0%, #2563EB 100%)', padding: '20px', borderRadius: '20px', color: 'white', marginBottom: '16px', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', marginBottom: '20px', lineHeight: '1.4', opacity: 0.95 }}>
              Maaliwalas ang panahon ngayon. Inaasahan ang pag-ulan bandang 4 PM.
            </p>
            
            {/* Hourly */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>Ngayon</span>
                <Sun size={24} color="#FDE047" fill="#FDE047" />
                <span style={{ fontSize: '15px', fontWeight: '700' }}>32°</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>2 PM</span>
                <Sun size={24} color="#FDE047" fill="#FDE047" />
                <span style={{ fontSize: '15px', fontWeight: '700' }}>34°</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>3 PM</span>
                <Cloud size={24} color="#E2E8F0" fill="#E2E8F0" />
                <span style={{ fontSize: '15px', fontWeight: '700' }}>31°</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>4 PM</span>
                <CloudRain size={24} color="#93C5FD" fill="#93C5FD" />
                <span style={{ fontSize: '15px', fontWeight: '700' }}>28°</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>5 PM</span>
                <CloudRain size={24} color="#93C5FD" fill="#93C5FD" />
                <span style={{ fontSize: '15px', fontWeight: '700' }}>26°</span>
              </div>
            </div>

            {/* Daily */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', width: '64px' }}>Ngayon</span>
                <Sun size={20} color="#FDE047" fill="#FDE047" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '14px', opacity: 0.8, width: '24px' }}>25°</span>
                <div style={{ flex: 1, margin: '0 12px', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ width: '80%', height: '100%', backgroundColor: '#FDE047', borderRadius: '2px', marginLeft: '10%' }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', width: '24px', textAlign: 'right' }}>34°</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', width: '64px' }}>Bukas</span>
                <CloudRain size={20} color="#93C5FD" fill="#93C5FD" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '14px', opacity: 0.8, width: '24px' }}>24°</span>
                <div style={{ flex: 1, margin: '0 12px', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ width: '60%', height: '100%', backgroundColor: '#93C5FD', borderRadius: '2px', marginLeft: '5%' }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', width: '24px', textAlign: 'right' }}>29°</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', width: '64px' }}>Huwebes</span>
                <CloudRain size={20} color="#93C5FD" fill="#93C5FD" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '14px', opacity: 0.8, width: '24px' }}>23°</span>
                <div style={{ flex: 1, margin: '0 12px', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ width: '40%', height: '100%', backgroundColor: '#93C5FD', borderRadius: '2px', marginLeft: '0%' }}></div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', width: '24px', textAlign: 'right' }}>27°</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setCurrentScreen("MAIN_HUB")}
            style={{ width: '100%', padding: '14px', backgroundColor: 'white', color: '#0369A1', borderRadius: '24px', border: '1.5px solid #0369A1', fontWeight: '700', fontSize: '14px', marginBottom: '24px' }}
          >
            Bumalik sa Hub
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {currentScreen === "HOME" && renderScreen1()}
      {currentScreen === "ONBOARDING" && renderScreen2()}
      {currentScreen === "MAIN_HUB" && renderScreen3()}
      {currentScreen === "DASHBOARD" && renderScreen5()}
      {currentScreen === "GINSURE" && renderScreen6()}

      {/* Global Toast Notification */}
      {showToast && (
        <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10B981', color: 'white', padding: '12px 24px', borderRadius: '30px', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px', animation: 'fadeInDown 0.3s ease-out' }}>
          <CheckCircle2 size={16} strokeWidth={2.5} /> Negosyante Tag Activated!
        </div>
      )}

      {/* Zoomed QR Modal */}
      {showZoomedQR && (
        <div 
          onClick={() => {
            setShowZoomedQR(false);
            simulateQRTransaction();
            setCurrentScreen("DASHBOARD");
          }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', animation: 'fadeIn 0.2s ease-out' }}
        >
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'scale(1.1)', boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#005CEE', marginBottom: '24px' }}>Aling Tess Fresh Fish</h2>
            <div style={{ padding: '8px', border: '2px dashed #CBD5E1', borderRadius: '12px' }}>
              <QrCode size={150} color="#1E293B" strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '16px', fontWeight: '600' }}>I-scan via QR Ph</p>
          </div>
          <p style={{ color: 'white', marginTop: '40px', fontSize: '14px', fontWeight: '600', opacity: 0.9, backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '20px' }}>
            👆 I-tap para sa Live Repayment Tracker
          </p>
        </div>
      )}
      
      {/* Global CSS specific to page rendering if needed, mostly handled in globals.css */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInDown {
          0% { transform: translate(-50%, -20px); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
