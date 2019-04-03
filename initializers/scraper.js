'use strict'

module.exports = {
    initialize:function(api, next){
        api.scraper = {
            config: {
                proxies: [
                    'ec2-35-163-189-239.us-west-2.compute.amazonaws.com',
                    'ec2-35-160-106-180.us-west-2.compute.amazonaws.com',
                    'ec2-35-165-1-211.us-west-2.compute.amazonaws.com',
                    'ec2-52-43-207-212.us-west-2.compute.amazonaws.com',
                    'ec2-34-213-236-242.us-west-2.compute.amazonaws.com',
                    'ec2-52-36-24-63.us-west-2.compute.amazonaws.com',
                    'ec2-52-26-166-176.us-west-2.compute.amazonaws.com',
                    'ec2-35-162-237-18.us-west-2.compute.amazonaws.com',
                    'ec2-34-212-183-134.us-west-2.compute.amazonaws.com',
                    'ec2-52-26-65-37.us-west-2.compute.amazonaws.com',
                    'ec2-34-212-238-156.us-west-2.compute.amazonaws.com',
                    'ec2-52-39-236-137.us-west-2.compute.amazonaws.com',
                    'ec2-34-208-148-121.us-west-2.compute.amazonaws.com',
                    'ec2-34-213-200-88.us-west-2.compute.amazonaws.com',
                    'ec2-52-42-221-217.us-west-2.compute.amazonaws.com',
                    'ec2-52-36-105-200.us-west-2.compute.amazonaws.com',
                    'ec2-52-38-66-159.us-west-2.compute.amazonaws.com',
                    'ec2-52-24-191-97.us-west-2.compute.amazonaws.com',
                    'ec2-34-213-165-214.us-west-2.compute.amazonaws.com',
                    'ec2-34-212-244-163.us-west-2.compute.amazonaws.com',
                    'ec2-34-229-171-183.compute-1.amazonaws.com',
                    'ec2-54-174-220-3.compute-1.amazonaws.com',
                    'ec2-54-224-215-108.compute-1.amazonaws.com',
                    'ec2-107-21-129-173.compute-1.amazonaws.com',
                    'ec2-34-203-30-92.compute-1.amazonaws.com',
                    'ec2-34-224-33-138.compute-1.amazonaws.com',
                    'ec2-52-207-198-4.compute-1.amazonaws.com',
                    'ec2-107-21-157-28.compute-1.amazonaws.com',
                    'ec2-184-73-24-252.compute-1.amazonaws.com',
        'ec2-54-158-0-207.compute-1.amazonaws.com',
        'ec2-54-144-204-101.compute-1.amazonaws.com',
        'ec2-34-229-7-98.compute-1.amazonaws.com',
        'ec2-54-236-7-171.compute-1.amazonaws.com',
        'ec2-34-203-234-14.compute-1.amazonaws.com',
        'ec2-54-227-153-80.compute-1.amazonaws.com',
        'ec2-54-162-214-138.compute-1.amazonaws.com',
        'ec2-54-152-175-46.compute-1.amazonaws.com',
        'ec2-52-207-227-101.compute-1.amazonaws.com',
        'ec2-34-228-200-83.compute-1.amazonaws.com',
        'ec2-34-234-84-244.compute-1.amazonaws.com',
        'ec2-34-234-84-244.compute-1.amazonaws.com',
        'ec2-52-90-160-188.compute-1.amazonaws.com',
        'ec2-34-228-59-211.compute-1.amazonaws.com',
        'ec2-54-205-184-2.compute-1.amazonaws.com',
        'ec2-54-174-161-141.compute-1.amazonaws.com',
        'ec2-54-205-204-233.compute-1.amazonaws.com',
        'ec2-54-174-168-53.compute-1.amazonaws.com',
        'ec2-54-152-229-2.compute-1.amazonaws.com',
        'ec2-54-237-139-191.compute-1.amazonaws.com',
        'ec2-34-228-61-213.compute-1.amazonaws.com',
        'ec2-52-91-225-136.compute-1.amazonaws.com',
        'ec2-34-207-82-56.compute-1.amazonaws.com',
        'ec2-52-90-0-129.compute-1.amazonaws.com',
        'ec2-52-87-246-181.compute-1.amazonaws.com',
        'ec2-107-21-12-95.compute-1.amazonaws.com',
        'ec2-54-197-160-142.compute-1.amazonaws.com',
        'ec2-34-229-19-21.compute-1.amazonaws.com',
        'ec2-54-152-196-216.compute-1.amazonaws.com',
        'ec2-34-234-76-174.compute-1.amazonaws.com'
                ]
            },
            all    : (params, next) => {
                let proxy = 0;

                const query = {"mortgageValue.date": {$lt: new Date(2017,7,30) },$and:[{"mortgageValue.link":{$exists:true}},{"mortgageValue.link":{$not:{$type:10}}}]};
                const stream = api.models.Property.find(query).skip(Number(params.skip)).limit(Number(params.limit)).stream();
                stream.on('data', function (item) {
                    const server = api.scraper.config.proxies[proxy];
                    api.tasks.enqueue('processZillowScraper', {property: item, server: server}, 'default');
                    proxy++;
                    if(proxy >= api.scraper.config.proxies.length) {
                        proxy = 0;
                    }
                });
                stream.on('error', function (err) {
                    next(err);
                });
                stream.on('close', function (foo) {
                    next(null,'!!!! Batch Complete !!!!');
                });
            },
        }
        next();
    }
};