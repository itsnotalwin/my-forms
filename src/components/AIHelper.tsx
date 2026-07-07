/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownRight, Check, Plus } from 'lucide-react';
import { AGREEMENT_TEMPLATES } from '../data/templates';

interface AIHelperProps {
  onSelectTemplates: (templateIds: string[], notes: string) => void;
  isDarkMode?: boolean;
}

interface AIResponse {
  message: string;
  recommendedTemplateIds: string[];
  explanation: string[];
}

export default function AIHelper({ onSelectTemplates, isDarkMode = false }: AIHelperProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simple client-side NLP / Keyword matcher for immediate, stunning recommendations
  const analyzeQuery = (text: string): AIResponse => {
    const lowercase = text.toLowerCase();
    
    // Default response
    let message = "I've analyzed your shoot description. To protect your copyright and cover liability, here are the recommended contracts:";
    let templateIds: string[] = ['model-release'];
    let explanation: string[] = [
      "Standard Model Release: Secures commercial & promotional permissions from adult models."
    ];

    if (lowercase.includes('minor') || lowercase.includes('under 18') || lowercase.includes('teen') || lowercase.includes('kid') || lowercase.includes('child') || lowercase.includes('years old') && (lowercase.includes('15') || lowercase.includes('16') || lowercase.includes('17') || lowercase.includes('14'))) {
      templateIds = ['minor-release'];
      message = "Since you mentioned a minor model (under 18), South African law requires a parent or legal guardian to co-sign the release. Here is the perfect setup:";
      explanation = [
        "Minor Model Release: Fully indemnifies the photographer, with mandatory Parent/Guardian co-signing section.",
        "Photographer Service Agreement: Protects booking fees, cancellation, and defines delivery timelines."
      ];
      if (lowercase.includes('paid') || lowercase.includes('brand') || lowercase.includes('client')) {
        templateIds.push('service-agreement');
      }
    } else if (lowercase.includes('tfp') || lowercase.includes('trade') || lowercase.includes('portfolio') || lowercase.includes('collab')) {
      templateIds = ['tfp-agreement', 'model-release'];
      message = "For mutual portfolio building (Trade For Portfolio), clearly defining copyright and deliverable expectations prevents disputes. I recommend:";
      explanation = [
        "TFP Agreement: Formalizes that no money changes hands, guarantees high-res edits, and prohibits commercial resale without consent.",
        "Standard Model Release: Ensures you both can use the final files on portfolios and social media."
      ];
    } else if (lowercase.includes('brand') || lowercase.includes('commercial') || lowercase.includes('sponsor') || lowercase.includes('paid brand')) {
      templateIds = ['content-creator', 'licensing-agreement', 'model-release'];
      message = "For commercial brand campaigns with strict deliverables and multi-channel marketing, I recommend this high-protection bundle:";
      explanation = [
        "Content Creator Agreement: Clearly outlines video/post deliverables, publishing schedules, and brand approval cycles.",
        "Image Licensing Agreement: Restricts commercial usage to specific media, durations (e.g. 2 years), and territory.",
        "Standard Model Release: Legally clears the model's likeness for paid advertising."
      ];
    } else if (lowercase.includes('drone') || lowercase.includes('aerial') || lowercase.includes('helicopter') || lowercase.includes('uav')) {
      templateIds = ['drone-consent', 'property-release', 'service-agreement'];
      message = "Aerial drone operations are highly regulated in South Africa by SACAA. You need safety clearance and property owner consent. Recommended bundle:";
      explanation = [
        "Drone Operations Consent: Secures safety compliance logs, liability releases, and aerial launch consent.",
        "Property Release Form: Grants explicit right to publish aerial footage of estates, businesses, or private lands.",
        "Photographer Service Agreement: Outlines service fees and weather-dependent rescheduling clauses."
      ];
    } else if (lowercase.includes('airbnb') || lowercase.includes('house') || lowercase.includes('property') || lowercase.includes('interior') || lowercase.includes('office') || lowercase.includes('hotel') || lowercase.includes('car')) {
      templateIds = ['property-release', 'service-agreement'];
      message = "For real estate, commercial venues, and high-value properties (like Airbnbs or cars), you need owner permission to publish commercially. Setup:";
      explanation = [
        "Property Release Form: Protects you against trespassing or intellectual property claims from property/building owners.",
        "Photographer Service Agreement: Specifies commercial delivery, day rates, and booking deposits."
      ];
    } else if (lowercase.includes('wedding') || lowercase.includes('marry') || lowercase.includes('marriage') || lowercase.includes('event')) {
      templateIds = ['service-agreement', 'print-release', 'event-notice'];
      message = "Events and weddings involve large crowds, high investment, and multiple print requests. I recommend this robust combination:";
      explanation = [
        "Photographer Service Agreement: Crucial for weddings! Specifies overtime rates, cancellation policies, delivery, and backup expectations.",
        "Print Release Form: Grants the couple the right to print high-res files anywhere for personal use, which saves you print-fulfillment admin.",
        "Event Photography Notice: Essential to post at the venue entrance to cover crowd crowd-releases for guests."
      ];
    } else if (lowercase.includes('nda') || lowercase.includes('confidential') || lowercase.includes('secret') || lowercase.includes('private')) {
      templateIds = ['nda', 'model-release'];
      message = "For high-profile shoots, exclusive product pre-launches, or confidential clients, an NDA is critical. Recommended:";
      explanation = [
        "Non-Disclosure Agreement (NDA): Imposes legal penalties and damages for early social media leaks or pre-launch file sharing.",
        "Standard Model Release: Pre-clears likeness for when the campaign finally goes live."
      ];
    }

    return {
      message,
      recommendedTemplateIds: templateIds,
      explanation
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = analyzeQuery(query);
      setResponse(res);
      setIsAnalyzing(false);
    }, 600); // realistic thinking effect
  };

  const handleApply = () => {
    if (!response) return;
    const notesText = `Drafted via Parchment AI Helper. Scenario: "${query}". Selected: ${response.recommendedTemplateIds.join(', ')}`;
    onSelectTemplates(response.recommendedTemplateIds, notesText);
  };

  const examples = [
    "I am shooting a 16 year old swimwear model at Clifton Beach",
    "Paid brand campaign for a Durban cosmetics company",
    "Commercial real estate & drone shoot for an Airbnb in Franschhoek",
    "TFP portfolio collab with a fashion model next Tuesday"
  ];

  return (
    <div className={`p-5 rounded-xl border ${
      isDarkMode 
        ? 'bg-cocoa-surface border-espresso text-alabaster' 
        : 'bg-[#fdfbf7] border-sand text-espresso'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-cocoa-surface-light text-sand' : 'bg-oatmeal text-espresso'}`}>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-base">Parchment AI Assistant</h3>
          <p className={`text-xs ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>
            Describe your shoot to select the correct South African contracts instantly.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            id="ai-helper-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Paid brand shoot with a minor model and drone aerials..."
            className={`w-full pl-4 pr-12 py-3 text-sm rounded-lg border focus:outline-none transition-colors ${
              isDarkMode 
                ? 'bg-cocoa-surface-light border-espresso focus:border-sand text-alabaster placeholder:text-alabaster/30' 
                : 'bg-white border-sand focus:border-espresso text-espresso placeholder:text-espresso/30'
            }`}
          />
          <button
            type="submit"
            id="ai-helper-submit"
            disabled={isAnalyzing || !query.trim()}
            className={`absolute right-2 top-2 p-1.5 rounded-md transition-colors ${
              isAnalyzing 
                ? 'opacity-50 cursor-not-allowed' 
                : isDarkMode 
                  ? 'bg-sand text-cocoa hover:bg-alabaster' 
                  : 'bg-espresso text-oatmeal hover:bg-espresso/80'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Examples */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {examples.map((ex, idx) => (
            <button
              key={idx}
              type="button"
              id={`ai-example-${idx}`}
              onClick={() => {
                setQuery(ex);
                setIsAnalyzing(true);
                setTimeout(() => {
                  setResponse(analyzeQuery(ex));
                  setIsAnalyzing(false);
                }, 400);
              }}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all hover:scale-[1.02] text-left max-w-full truncate ${
                isDarkMode 
                  ? 'bg-cocoa-surface-light border-espresso text-alabaster/70 hover:text-alabaster hover:border-sand/40' 
                  : 'bg-oatmeal border-sand text-espresso/75 hover:text-espresso hover:border-espresso/30'
              }`}
            >
              "{ex}"
            </button>
          ))}
        </div>
      </form>

      {/* Loading Animation */}
      {isAnalyzing && (
        <div className="flex items-center justify-center py-8 gap-2">
          <div className="w-2 h-2 rounded-full bg-sand animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-sand animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-sand animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className={`text-xs ml-2 font-mono ${isDarkMode ? 'text-alabaster/60' : 'text-espresso/60'}`}>Consulting SA Templates...</span>
        </div>
      )}

      {/* AI Recommendation Output */}
      {response && !isAnalyzing && (
        <div className={`mt-5 p-4 rounded-lg border transition-all animate-fadeIn ${
          isDarkMode ? 'bg-cocoa-surface-light/60 border-espresso/50' : 'bg-[#faf6f0]/55 border-sand/60'
        }`}>
          <p className="text-xs font-semibold uppercase tracking-wider text-sand mb-2">AI Draft Recommendation</p>
          <p className="text-sm font-medium mb-3">{response.message}</p>
          
          <div className="space-y-2 mb-4">
            {response.explanation.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CornerDownRight className="w-3.5 h-3.5 text-sand mt-0.5 shrink-0" />
                <span className={isDarkMode ? 'text-alabaster/80' : 'text-espresso/80'}>{exp}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-dashed border-sand/40">
            <button
              type="button"
              id="ai-apply-templates"
              onClick={handleApply}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-display font-medium text-xs shadow-sm hover:scale-[1.01] transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-sand text-cocoa hover:bg-alabaster' 
                  : 'bg-espresso text-oatmeal hover:bg-espresso/90'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Draft Shoot with {response.recommendedTemplateIds.length} Contracts
            </button>
            <button
              type="button"
              id="ai-clear-response"
              onClick={() => {
                setResponse(null);
                setQuery('');
              }}
              className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                isDarkMode 
                  ? 'border-espresso text-alabaster/60 hover:text-alabaster hover:bg-cocoa-surface-light' 
                  : 'border-sand text-espresso/60 hover:text-espresso hover:bg-sand/20'
              }`}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
