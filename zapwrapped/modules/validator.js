// Validador de Inicialização
// Execute isto no console para verificar se tudo está funcionando

class InitValidator {
    static runChecks() {
        console.log('%c🚀 ZapWrapped - Validation Report', 'font-size: 16px; color: #25D366; font-weight: bold');
        console.log('=====================================\n');

        const checks = {
            modules: this.checkModules(),
            dom: this.checkDOM(),
            functionality: this.checkFunctionality(),
            styles: this.checkStyles()
        };

        this.printReport(checks);
        return checks;
    }

    static checkModules() {
        console.log('%c📦 Checking Modules...', 'color: #00D9FF; font-weight: bold');
        
        const modules = {
            ChatParser: typeof ChatParser !== 'undefined',
            ChatAnalyzer: typeof ChatAnalyzer !== 'undefined',
            SlideRenderer: typeof SlideRenderer !== 'undefined',
            AnimationSystem: typeof AnimationSystem !== 'undefined',
            ExportSystem: typeof ExportSystem !== 'undefined',
            AdvancedAnalytics: typeof AdvancedAnalytics !== 'undefined',
            CacheManager: typeof CacheManager !== 'undefined',
            DataValidator: typeof DataValidator !== 'undefined',
            ZapWrappedApp: typeof ZapWrappedApp !== 'undefined',
        };

        Object.entries(modules).forEach(([name, loaded]) => {
            const status = loaded ? '✅' : '❌';
            console.log(`  ${status} ${name}`);
        });

        return Object.values(modules).every(v => v);
    }

    static checkDOM() {
        console.log('\n%c🎨 Checking DOM Elements...', 'color: #8B5CF6; font-weight: bold');
        
        const elements = {
            'landing page': document.getElementById('landing'),
            'stories page': document.getElementById('stories'),
            'summary page': document.getElementById('summary'),
            'drop zone': document.getElementById('dropZone'),
            'file input': document.getElementById('fileInput'),
            'slides wrapper': document.getElementById('slidesWrapper'),
            'summary content': document.getElementById('summaryContent'),
        };

        Object.entries(elements).forEach(([name, element]) => {
            const status = element ? '✅' : '❌';
            console.log(`  ${status} ${name}`);
        });

        return Object.values(elements).every(v => v);
    }

    static checkFunctionality() {
        console.log('\n%c⚙️ Checking Functionality...', 'color: #FFD700; font-weight: bold');
        
        const functions = {
            'Parse files': typeof ChatParser.parseFile === 'function',
            'Analyze data': typeof ChatAnalyzer === 'function',
            'Generate slides': typeof SlideRenderer.generateSlides === 'function',
            'Animate elements': typeof AnimationSystem.animate === 'function',
            'Export as screenshot': typeof ExportSystem.exportAsScreenshot === 'function',
            'Main app': typeof ZapWrappedApp === 'function' || typeof app === 'object',
        };

        Object.entries(functions).forEach(([name, available]) => {
            const status = available ? '✅' : '❌';
            console.log(`  ${status} ${name}`);
        });

        return Object.values(functions).every(v => v);
    }

    static checkStyles() {
        console.log('\n%c🎨 Checking Styles...', 'color: #25D366; font-weight: bold');
        
        const styles = {
            'CSS variables loaded': getComputedStyle(document.documentElement).getPropertyValue('--whatsapp-green').trim().length > 0,
            'Dark mode active': document.body.style.background || window.getComputedStyle(document.body).backgroundColor,
            'Animations defined': document.querySelector('style') !== null,
        };

        Object.entries(styles).forEach(([name, available]) => {
            const status = available ? '✅' : '❌';
            console.log(`  ${status} ${name}`);
        });

        return Object.values(styles).every(v => v);
    }

    static printReport(checks) {
        console.log('\n%c📊 Summary', 'color: #00D9FF; font-weight: bold; font-size: 14px');
        console.log('=====================================');
        console.log(`  Modules: ${checks.modules ? '✅ OK' : '❌ FAIL'}`);
        console.log(`  DOM: ${checks.dom ? '✅ OK' : '❌ FAIL'}`);
        console.log(`  Functionality: ${checks.functionality ? '✅ OK' : '❌ FAIL'}`);
        console.log(`  Styles: ${checks.styles ? '✅ OK' : '❌ FAIL'}`);
        
        const allOk = Object.values(checks).every(v => v);
        console.log('\n%c' + (allOk ? '✅ ALL SYSTEMS GO!' : '❌ SOME ISSUES FOUND'), 
            `color: ${allOk ? '#25D366' : '#FF6B6B'}; font-weight: bold; font-size: 14px`);
        console.log('=====================================\n');

        return allOk;
    }

    static testParse() {
        console.log('%c🧪 Testing Parser...', 'color: #00D9FF; font-weight: bold');
        
        const testMessage = '[01/01/2024, 10:30:45] João: Olá! 🎉';
        console.log(`  Input: ${testMessage}`);
        
        const parsed = ChatParser.parseText(testMessage);
        if (parsed.length > 0) {
            console.log(`  ✅ Parsed successfully`);
            console.log(`  Sender: ${parsed[0].sender}`);
            console.log(`  Content: ${parsed[0].content}`);
        } else {
            console.log(`  ❌ Parse failed`);
        }
    }

    static testAnalyzer() {
        console.log('\n%c🧪 Testing Analyzer...', 'color: #00D9FF; font-weight: bold');
        
        const testMessages = [
            { 
                timestamp: new Date('2024-01-01'), 
                sender: 'João', 
                content: 'Olá pessoal! 😊',
                type: 'text',
                isMedia: false
            },
            { 
                timestamp: new Date('2024-01-01'), 
                sender: 'Maria', 
                content: 'E aí? Tudo bem? 🙌',
                type: 'text',
                isMedia: false
            }
        ];

        const analyzer = new ChatAnalyzer(testMessages);
        const stats = analyzer.getStats();
        
        console.log(`  ✅ Analyzer working`);
        console.log(`  Total messages: ${stats.totalMessages}`);
        console.log(`  Participants: ${stats.participants.length}`);
    }

    static testAnimation() {
        console.log('\n%c🧪 Testing Animations...', 'color: #00D9FF; font-weight: bold');
        
        const testEl = document.createElement('div');
        testEl.textContent = 'Test Element';
        testEl.style.cssText = 'position: fixed; top: 100px; left: 100px; background: #25D366; padding: 10px; border-radius: 5px;';
        document.body.appendChild(testEl);

        AnimationSystem.animate(testEl, 'bounce', 0.5).then(() => {
            console.log(`  ✅ Animation completed`);
            testEl.remove();
        });
    }

    static showDebugInfo() {
        console.log('\n%c🔧 Debug Info', 'color: #FFD700; font-weight: bold');
        console.log(`  Browser: ${navigator.userAgent.split(' ').pop()}`);
        console.log(`  Window size: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`  App instance: ${typeof app !== 'undefined' ? '✅ Available' : '❌ Not available'}`);
        console.log(`  Storage available: ${typeof(Storage) !== 'undefined' ? '✅ Yes' : '❌ No'}`);
    }
}

// Executar automaticamente ao carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✨ ZapWrapped Loaded!', 'font-size: 20px; color: #25D366; font-weight: bold');
    console.log('Type: InitValidator.runChecks() to validate');
    console.log('Type: InitValidator.testParse() to test parser');
    console.log('Type: InitValidator.testAnalyzer() to test analyzer');
    console.log('Type: InitValidator.testAnimation() to test animations');
});
